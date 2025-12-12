import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AlertaModal.css'; 

const API_BASE_URL = 'http://localhost:8080/api/alertas';

const AlertaModal = ({ isOpen, onClose, alertaData, veiculos }) => {
    // Inicializa o estado com dados vazios para novo alerta, ou com os dados de edição
    const [formData, setFormData] = useState({
        tipo: '',
        descricao: '',
        data: new Date().toISOString().substring(0, 10), // Data atual no formato YYYY-MM-DD
        fk_idveiculo: '', // ID do veículo para o relacionamento
    });

    useEffect(() => {
        if (alertaData) {
            // Se for edição, preenche o formulário
            setFormData({
                tipo: alertaData.tipo || '',
                descricao: alertaData.descricao || '',
                data: alertaData.data || new Date().toISOString().substring(0, 10),
                fk_idveiculo: alertaData.veiculo ? alertaData.veiculo.id_veiculo : '',
            });
        }
    }, [alertaData]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 1. Prepara o objeto a ser enviado, convertendo o fk_idveiculo
        const alertaPayload = {
            ...formData,
            veiculo: {
                id_veiculo: formData.fk_idveiculo
            }
        };

        // 2. Remove o campo fk_idveiculo do payload, pois o backend espera o objeto 'veiculo'
        delete alertaPayload.fk_idveiculo;

        try {
            if (alertaData) {
                // Edição (PUT)
                await axios.put(`${API_BASE_URL}/${alertaData.id_alerta}`, alertaPayload);
            } else {
                // Cadastro (POST)
                await axios.post(API_BASE_URL, alertaPayload);
            }
            onClose(); // Fecha o modal e recarrega a lista
        } catch (error) {
            console.error("Erro ao salvar alerta:", error);
            alert("Erro ao salvar alerta. Verifique o console.");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{alertaData ? 'Editar Alerta' : 'Novo Alerta'}</h2>
                <form onSubmit={handleSubmit}>
                    
                    <div className="form-group">
                        <label htmlFor="fk_idveiculo">Veículo</label>
                        <select
                            name="fk_idveiculo"
                            id="fk_idveiculo"
                            value={formData.fk_idveiculo}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecione o Veículo</option>
                            {/* Note que 'veiculos' são passados como props do componente pai */}
                            {veiculos.map(v => (
                                <option key={v.id_veiculo} value={v.id_veiculo}>
                                    {v.placa} ({v.modelo})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="tipo">Tipo de Alerta</label>
                        <input
                            type="text"
                            id="tipo"
                            name="tipo"
                            value={formData.tipo}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="descricao">Descrição</label>
                        <textarea
                            id="descricao"
                            name="descricao"
                            value={formData.descricao}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="data">Data</label>
                        <input
                            type="date"
                            id="data"
                            name="data"
                            value={formData.data}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="modal-actions">
                        <button type="submit" className="btn-salvar">
                            {alertaData ? 'Atualizar' : 'Cadastrar'}
                        </button>
                        <button type="button" className="btn-cancelar" onClick={onClose}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AlertaModal;