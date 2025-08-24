'use client';

import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface Column<T> {
    key: keyof T;
    header: string;
    render?: (value: T[keyof T], item: T) => React.ReactNode;
}

interface DataTableProps<T extends { id: string | number }> {
    title: string;
    data: T[];
    columns: Column<T>[];
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    onAdd?: () => void;
    isLoading?: boolean;
}

export function DataTable<T extends { id: string | number }>({
                                                                 title,
                                                                 data,
                                                                 columns,
                                                                 onEdit,
                                                                 onDelete,
                                                                 onAdd,
                                                                 isLoading = false,
                                                             }: DataTableProps<T>) {
    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-10 bg-muted rounded animate-pulse" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{title}</CardTitle>
                {onAdd && (
                    <Button onClick={onAdd}>
                        Ajouter
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((column) => (
                                <TableHead key={String(column.key)}>
                                    {column.header}
                                </TableHead>
                            ))}
                            {(onEdit || onDelete) && <TableHead>Actions</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length + 1} className="text-center py-8">
                                    Aucune donnée disponible
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((item) => (
                                <TableRow key={item.id}>
                                    {columns.map((column) => (
                                        <TableCell key={String(column.key)}>
                                            {column.render
                                                ? column.render(item[column.key], item)
                                                : String(item[column.key])}
                                        </TableCell>
                                    ))}
                                    {(onEdit || onDelete) && (
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                {onEdit && (
                                                    <Button variant="outline" size="sm" onClick={() => onEdit(item)}>
                                                        Modifier
                                                    </Button>
                                                )}
                                                {onDelete && (
                                                    <Button variant="destructive" size="sm" onClick={() => onDelete(item)}>
                                                        Supprimer
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
