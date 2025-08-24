'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

import { toast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

import { Product } from '@/types/Product';
import { Order, OrderItem, toApiOrder, calcOrderTotal } from '@/types/Order';

import { CancelConfirmationModal } from '@/components/modals/CancelConfirmationModal';

interface Client {
    id: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    companyName?: string;
}

interface EditOrderModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    order: Order | null;
    onUpdated: () => void;
}

export const EditOrderModal: React.FC<EditOrderModalProps> = ({
                                                                  open,
                                                                  onOpenChange,
                                                                  order,
                                                                  onUpdated,
                                                              }) => {
    const [clients, setClients] = useState<Client[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [clientId, setClientId] = useState('');
    const [items, setItems] = useState<OrderItem[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // modale d’annulation
    const [cancelOpen, setCancelOpen] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);

    // 🔓 on NE verrouille que FAILED ou CANCELLED
    const isLocked = useMemo(() => {
        const s = (order?.status || 'PENDING').toUpperCase();
        return s === 'FAILED' || s === 'CANCELLED';
    }, [order?.status]);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const res = await api.get<Client[]>('/clients');
                setClients(res.data);
            } catch {
                toast({
                    title: 'Erreur',
                    description: 'Impossible de charger les clients',
                    variant: 'destructive',
                });
            }
        };
        const fetchProducts = async () => {
            try {
                const res = await api.get<Product[]>('/products');
                setProducts(res.data);
            } catch {
                toast({
                    title: 'Erreur',
                    description: 'Impossible de charger les produits',
                    variant: 'destructive',
                });
            }
        };

        if (open) {
            fetchClients();
            fetchProducts();
            if (order) {
                setClientId(order.clientId);
                setItems(order.items || []);
            }
        }
    }, [open, order]);

    const addItem = () =>
        setItems((prev) => [...prev, { productId: 0, quantity: 1, unitPrice: 0 }]);

    const updateItem = (index: number, field: keyof OrderItem, value: any) => {
        setItems((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };

            if (field === 'productId') {
                const product = products.find((p) => p.id === Number(value));
                if (product) updated[index].unitPrice = product.price;
            }
            return updated;
        });
    };

    const removeItem = (index: number) =>
        setItems((prev) => prev.filter((_, i) => i !== index));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!order) return;

        if (!clientId || items.length === 0) {
            toast({
                title: 'Erreur',
                description: 'Veuillez sélectionner un client et au moins un produit',
                variant: 'destructive',
            });
            return;
        }

        if (isLocked) {
            toast({
                title: 'Modification impossible',
                description: 'Cette commande est verrouillée (statut final).',
                variant: 'destructive',
            });
            return;
        }

        setIsSubmitting(true);
        try {
            // on repasse status courant tel quel ; les deltas d’items seront gérés par le back (order.updated)
            await api.patch(`/orders/${order.id}`, toApiOrder({ clientId, items, status: order.status }));
            toast({ title: 'Commande modifiée' });
            onUpdated();
            onOpenChange(false);
        } catch {
            toast({ title: 'Erreur', description: 'Modification échouée', variant: 'destructive' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Confirmation d’annulation via modale custom
    const confirmCancel = async () => {
        if (!order?.id) return;
        setIsCancelling(true);
        try {
            // PATCH avec status=CANCELLED (le back publie order.cancelled → restock côté products)
            await api.patch(`/orders/${order.id}`, toApiOrder({ clientId, items, status: 'CANCELLED' as any }));
            toast({ title: 'Commande annulée' });
            onUpdated();
            onOpenChange(false);
        } catch {
            toast({ title: 'Erreur', description: 'Annulation échouée', variant: 'destructive' });
        } finally {
            setIsCancelling(false);
        }
    };

    if (!order) return null;

    const StatusBanner = () => {
        const s = (order.status || 'PENDING').toUpperCase();
        if (s === 'PENDING') {
            return (
                <div className="rounded-md border border-yellow-300 bg-yellow-50 p-3 text-sm">
                    <span className="font-medium">Statut :</span> En attente de confirmation des stocks…
                    <div className="mt-1">
                        <Badge variant="secondary">PENDING</Badge>
                    </div>
                </div>
            );
        }
        if (s === 'CONFIRMED') {
            return (
                <div className="rounded-md border border-emerald-300 bg-emerald-50 p-3 text-sm">
                    <span className="font-medium">Statut :</span> Confirmée
                    <div className="mt-1">
                        <Badge variant="default">CONFIRMED</Badge>
                    </div>
                </div>
            );
        }
        if (isLocked) {
            return (
                <div className="rounded-md border border-muted-foreground/20 bg-muted p-3 text-sm">
                    <span className="font-medium">Statut :</span>{' '}
                    {s === 'FAILED' ? 'Échouée' : 'Annulée'} — modification verrouillée.
                    <div className="mt-1">
                        <Badge variant="destructive">{s}</Badge>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[700px]">
                    <DialogHeader>
                        <DialogTitle>Modifier la commande #{order.id}</DialogTitle>
                        <DialogDescription>Modifiez le client et les produits.</DialogDescription>
                    </DialogHeader>

                    <div className="mb-2">
                        <StatusBanner />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Client */}
                        <div className="space-y-2">
                            <Label>Client</Label>
                            <Select value={clientId} onValueChange={setClientId} disabled={isLocked}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner un client" />
                                </SelectTrigger>
                                <SelectContent>
                                    {clients.map((c) => (
                                        <SelectItem key={c.id} value={String(c.id)}>
                                            {c.name ||
                                                `${c.firstName ?? ''} ${c.lastName ?? ''}`.trim() ||
                                                c.companyName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Produits */}
                        <div className="space-y-3">
                            {items.map((item, idx) => (
                                <div key={idx} className="grid grid-cols-4 gap-3 items-end">
                                    <Select
                                        value={item.productId ? String(item.productId) : ''}
                                        onValueChange={(v) => updateItem(idx, 'productId', Number(v))}
                                        disabled={isLocked}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Produit" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {products.map((p) => (
                                                <SelectItem key={p.id} value={String(p.id)}>
                                                    {p.name} (€{p.price})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <Input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) => updateItem(idx, 'quantity', Number(e.target.value))}
                                        disabled={isLocked}
                                    />

                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={item.unitPrice}
                                        onChange={(e) => updateItem(idx, 'unitPrice', Number(e.target.value))}
                                        disabled={isLocked}
                                    />

                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={() => removeItem(idx)}
                                        disabled={isLocked}
                                    >
                                        Supprimer
                                    </Button>
                                </div>
                            ))}

                            <Button type="button" variant="outline" onClick={addItem} disabled={isLocked}>
                                Ajouter un produit
                            </Button>
                        </div>

                        {/* Total */}
                        <div className="p-4 bg-muted rounded-lg font-semibold">
                            Total : €{calcOrderTotal({ items }).toFixed(2)}
                        </div>

                        <DialogFooter className="flex gap-2">
                            {(order.status || 'PENDING').toUpperCase() !== 'CANCELLED' && (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => setCancelOpen(true)}
                                    disabled={isCancelling}
                                >
                                    {isCancelling ? 'Annulation…' : 'Annuler la commande'}
                                </Button>
                            )}
                            <Button type="submit" disabled={isLocked || isSubmitting}>
                                {isLocked ? 'Modification verrouillée' : isSubmitting ? 'Modification…' : 'Modifier la commande'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modale d’annulation */}
            <CancelConfirmationModal
                open={cancelOpen}
                onOpenChange={setCancelOpen}
                onConfirm={confirmCancel}
                title="Annuler la commande"
                description="La commande sera marquée comme annulée et le stock sera rétabli."
                itemName={`Commande #${order?.id}`}
            />
        </>
    );
};
