import React, { useEffect, useState } from 'react';
import './NotificationToast.css';

const NotificationToast = ({ message, type, duration = 5000, onDismiss }) => {
    // Tipos de 'type': 'success' ou 'error'
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (isVisible) {
            // Configura o timer para fechar o toast
            const timer = setTimeout(() => {
                setIsVisible(false);
                // Chama a função de dismiss do componente pai após a animação
                setTimeout(onDismiss, 300); 
            }, duration);

            return () => clearTimeout(timer); // Limpa o timer se o componente for desmontado
        }
    }, [isVisible, duration, onDismiss]);

    if (!isVisible) return null;

    // Define o emoji e a classe de cor
    const icon = type === 'success' ? '✅' : '❌';
    const toastClass = `notification-toast toast-${type}`;

    return (
        // Renderiza o toast
        <div className={toastClass}>
            <span className="toast-icon">{icon}</span>
            <p className="toast-message">{message}</p>
            {/* Opcional: Botão para fechar manualmente */}
            <button className="toast-close" onClick={() => setIsVisible(false)}>
                &times;
            </button>
        </div>
    );
};

export default NotificationToast;