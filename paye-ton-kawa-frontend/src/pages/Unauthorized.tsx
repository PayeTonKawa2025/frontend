'use client';

import React from 'react';

const Unauthorized = () => {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-red-600">Accès refusé</h1>
                <p className="mt-2 text-muted-foreground">
                    Vous n'avez pas les permissions nécessaires pour accéder à cette page.
                </p>
            </div>
        </div>
    );
};

export default Unauthorized;
