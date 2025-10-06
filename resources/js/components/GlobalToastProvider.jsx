// File: resources/js/Components/GlobalToastProvider.jsx

import { createContext, useContext, useState } from 'react';

const ToastContext = createContext();

export function useToast() {
    return useContext(ToastContext);
}

export default function GlobalToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const showToast = (message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        
        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, 3000);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            
            {/* Toast Container */}
            <div className="fixed top-4 right-4 z-50 space-y-2">
                {toasts.map(toast => (
                    <div 
                        key={toast.id}
                        className="px-6 py-3 rounded-lg shadow-lg font-medium transform transition-all duration-300"
                        style={{
                            backgroundColor: toast.type === 'success' 
                                ? '#be1e2d'
                                : toast.type === 'error' 
                                ? '#dc2626' 
                                : '#3b82f6',
                            color: '#faf5f6'
                        }}
                    >
                        {toast.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
