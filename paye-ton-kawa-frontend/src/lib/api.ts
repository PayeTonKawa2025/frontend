// src/lib/api.ts

import axios from 'axios';

// Appels vers le gateway-api
export const api = axios.create({
    baseURL: '/api',   // Le proxy vers gateway-api (port 8089)
    withCredentials: true,
});

// Appels vers l'auth-service
export const authApi = axios.create({
    baseURL: '/auth',  // Le proxy vers auth-service (port 8084)
    withCredentials: true,
});
