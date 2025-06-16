'use client'

import { createContext, useContext, useState, ReactNode } from 'react';
import {ApiClient} from "@/lib/api";

interface ApiConfig {
    apiUrl: string;
    timeout: number;
}

const ApiClientContext = createContext<ApiConfig | null>(null);

export const ApiClientProvider = ({ children, initialConfig }: {
    children: ReactNode;
    initialConfig: ApiConfig;
}) => {
    const [config] = useState<ApiConfig>(initialConfig);

    return (
        <ApiClientContext.Provider value={config}>
            {children}
        </ApiClientContext.Provider>
    );
};

export const useClient = () => {
    const config = useContext(ApiClientContext);
    if (!config) throw new Error('useClient must be used within ApiClientProvider');
    if (!config.apiUrl) throw new Error('api url must be provided');
    return new ApiClient(config.apiUrl, config.timeout);
};
