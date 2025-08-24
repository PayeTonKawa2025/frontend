// ===== Modèle côté FRONT (confort d'usage) =====
export interface OrderItem {
    productId: number;   // correspond à Product.id
    quantity: number;
    unitPrice: number;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'FAILED' | 'CANCELLED';

export interface Order {
    id?: number;
    clientId: string;
    createdAt?: number;   // epoch ms
    status?: OrderStatus; // 👈 nouveau
    items: OrderItem[];
}

// ===== Modèle côté API =====
export interface ApiOrderItem {
    id?: number;
    itemId: string;       // string attendu par le back
    quantity: number;
    unitPrice: number | null;
}

export interface ApiOrder {
    id?: number;
    clientId: string;
    createdAt?: number;
    status?: OrderStatus; // 👈 nouveau
    items: ApiOrderItem[];
}

// ===== Helpers de mapping =====
export const toApiOrder = (o: Order): ApiOrder => ({
    id: o.id,
    clientId: o.clientId,
    createdAt: o.createdAt,
    status: o.status, // inutile pour POST/PATCH, mais on ne casse rien
    items: (o.items || []).map(it => ({
        id: undefined,
        itemId: String(it.productId),
        quantity: it.quantity,
        unitPrice: it.unitPrice ?? 0,
    })),
});

export const fromApiOrder = (api: ApiOrder): Order => ({
    id: api.id,
    clientId: api.clientId,
    createdAt: api.createdAt,
    status: api.status, // 👈 on récupère le statut
    items: (api.items || []).map(it => ({
        productId: Number(it.itemId),
        quantity: it.quantity,
        unitPrice: it.unitPrice ?? 0,
    })),
});

// ===== Utils =====
export const calcOrderTotal = (o: Pick<Order, 'items'>): number =>
    (o.items || []).reduce((acc, it) => acc + (it.unitPrice || 0) * (it.quantity || 0), 0);
