import React, { useState, useEffect } from 'react';
import { sendData } from '../../service/api'; 
import './SetorModal.css'; 

const SetorModal = ({ isOpen, onClose, setorData, allSetores }) => {
    // Estado inicial do formulário
    const [formData, setFormData] = useState({
        pai: null, // ID do setor pai
        descricao: '',
        nome_setor: '',
        responsavel: '',
    });
    
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (setorData) {
            // Preenche o formulário para edição
            setFormData({
                pai: setorData.pai || '', // Use '' ou null dependendo da sua API, aqui usamos null como padrão
                descricao: setorData.descricao || '',
                nome_setor: setorData.nome_setor || '',
                responsavel: setorData.responsavel || '',
            });
        } else {
             // Resetar para valores vazios ao abrir para novo cadastro
             setFormData({ pai: '', descricao: '', nome_setor: '', responsavel: '' });
        }
    }, [setorData]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Converte 'pai' para número se não for vazio, senão mantém null ou vazio.
        let parsedValue = value;
        if (name === 'pai') {
            parsedValue = value === '' ? null : parseInt(value, 10);
        }
        setFormData(prev => ({ ...prev, [name]: parsedValue }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const isEditing = !!setorData;

        // 1. Preparação dos Dados
        const dataToSend = { 
            ...formData,
            // Garante que se o campo for vazio (''), ele vá como null para a coluna 'pai' no BD
            pai: formData.pai === '' ? null : formData.pai,
        };
        
        const method = isEditing ? 'PUT' : 'POST';
        const endpoint = isEditing 
            ? `setores/${setorData.id}` 
            : 'setores';

        try {
            await sendData(method, endpoint, dataToSend);
            onClose(); 
        } catch (error) {
            console.error("Erro ao salvar setor:", error);
            alert("Erro ao salvar setor. Verifique o console.");
        } finally {
            setLoading(false);
        }
    };

    // Filtra a lista de setores para remover o próprio setor que está sendo editado 
    // (para evitar que um setor seja pai de si mesmo)
    const setoresDisponiveis = allSetores.filter(setor => setor.id !== setorData?.id);


    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{setorData ? 'Editar Setor' : 'Novo Setor'}</h2>
                <form onSubmit={handleSubmit}>
                    
                    {/* Linha 1: Nome do Setor */}
                    <div className="form-group">
                        <label htmlFor="nome_setor">Nome do Setor</label>
                        <input
                            type="text"
                            id="nome_setor"
                            name="nome_setor"
                            value={formData.nome_setor}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    {/* Linha 2: Setor Pai e Responsável */}
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="pai">Setor Pai (Opcional)</label>
                            <select
                                id="pai"
                                name="pai"
                                value={formData.pai || ''} // Usa '' para representar null/Nenhum
                                onChange={handleChange}
                            >
                                <option value="">Nenhum (Setor Raiz)</option>
                                {setoresDisponiveis.map(setor => (
                                    <option key={setor.id} value={setor.id}>
                                        {setor.nome_setor}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="responsavel">Responsável</label>
                            <input
                                type="text"
                                id="responsavel"
                                name="responsavel"
                                value={formData.responsavel}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Linha 3: Descrição */}
                    <div className="form-group">
                        <label htmlFor="descricao">Descrição</label>
                        <textarea
                            id="descricao"
                            name="descricao"
                            value={formData.descricao}
                            onChange={handleChange}
                            rows="3"
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-cancelar" onClick={onClose} disabled={loading}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-salvar" disabled={loading}>
                            {loading ? 'Salvando...' : (setorData ? 'Atualizar Setor' : 'Cadastrar Setor')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SetorModal;