export interface Role {
    id: number;
    name: string;
}

export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    password?: string;
    status?: 'active' | 'inactive';
    lastLogin?: string;
    createdAt?: string;

    // ❗Depuis /users → objets Role[]
    roles: string[]; // string[] depuis /me, Role[] depuis /users
}
