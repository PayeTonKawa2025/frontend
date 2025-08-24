'use client';

import React, { useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle, Ban } from 'lucide-react';

interface CancelConfirmationModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => Promise<void> | void;
    title?: string;
    description?: string;
    itemName?: string;
}

export const CancelConfirmationModal: React.FC<CancelConfirmationModalProps> = ({
                                                                                    open,
                                                                                    onOpenChange,
                                                                                    onConfirm,
                                                                                    title = 'Annuler la commande',
                                                                                    description = 'Cette action va annuler la commande et rétablir le stock des produits.',
                                                                                    itemName,
                                                                                }) => {
    const [isCancelling, setIsCancelling] = useState(false);

    const handleConfirm = async () => {
        setIsCancelling(true);
        await onConfirm();
        setIsCancelling(false);
        onOpenChange(false);
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className="flex items-center space-x-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                            <AlertTriangle className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                            <AlertDialogTitle>{title}</AlertDialogTitle>
                        </div>
                    </div>

                    <AlertDialogDescription className="text-left">
                        {description}
                    </AlertDialogDescription>

                    {itemName && (
                        <div className="mt-2 p-2 bg-muted rounded text-sm font-medium">
                            {itemName}
                        </div>
                    )}

                    <div className="mt-3 text-sm text-amber-600">
                        ⚠️ Cette action n’est pas réversible. La commande sera marquée <b>ANNULÉE</b>.
                    </div>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isCancelling}>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        disabled={isCancelling}
                        className="bg-amber-600 hover:bg-amber-700 focus:ring-amber-600"
                    >
                        <Ban className="h-4 w-4 mr-2" />
                        {isCancelling ? 'Annulation…' : 'Confirmer'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
