'use client';

import React, { useState } from 'react';
import { AuthForm } from '@/components/auth/AuthForm';

const Login: React.FC = () => {
    const [mode, setMode] = useState<'login' | 'register'>('login');

    return (
        <AuthForm
            mode={mode}
            onToggleMode={() => setMode(mode === 'login' ? 'register' : 'login')}
        />
    );
};

export default Login;
