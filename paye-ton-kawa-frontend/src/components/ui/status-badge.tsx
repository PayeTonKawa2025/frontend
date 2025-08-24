import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import type { OrderStatus } from '@/types/Order';

export const StatusBadge: React.FC<{ status?: string | OrderStatus }> = ({ status }) => {
    const s = (status || 'PENDING').toUpperCase() as OrderStatus;

    switch (s) {
        case 'CONFIRMED':
            return <Badge variant="default">Confirmée</Badge>;
        case 'FAILED':
            return <Badge variant="destructive">Échouée</Badge>;
        case 'CANCELLED':
            return <Badge variant="destructive">Annulée</Badge>;
        case 'PENDING':
        default:
            return <Badge variant="secondary">En attente</Badge>;
    }
};
