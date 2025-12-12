import React from 'react';
import './LoadingOverlay.css'; // O CSS para o spinner e o fundo

const LoadingOverlay = ({ message = 'Salvando...' }) => {
    return (
        // O overlay que cobre a tela
        <div className="loading-overlay">
            <div className="loading-content">
                {/* O elemento que será animado como spinner */}
                <div className="spinner"></div> 
                <p>{message}</p>
            </div>
        </div>
    );
};

export default LoadingOverlay;