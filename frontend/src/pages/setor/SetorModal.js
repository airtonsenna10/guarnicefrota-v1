import React, { useState, useEffect, useMemo } from 'react';
import LoadingOverlay from '../loadingoverlay/LoadingOverlay'; 
import { sendData } from '../../service/api';
import { FaTimes } from 'react-icons/fa';

const SetorModal = ({ onClose, onSetorSaved, setorToEdit, mode, allSetores }) => {

    const isViewMode = mode === 'view';
    const isEditMode = mode === 'edit';
    const isNewMode = mode === 'new';
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [erro, setErro] = useState('');

    const initialFormData = useMemo(() => ({
        nomeSetor: '',
        responsavel: '',
        descricao: '',
        setorSuperiorId: '', 
    }), []);

    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        if (setorToEdit && (isEditMode || isViewMode)) {
            setFormData({
                nomeSetor: setorToEdit.nomeSetor || '',
                responsavel: setorToEdit.responsavel || '',
                descricao: setorToEdit.descricao || '',
                setorSuperiorId: setorToEdit.setorSuperior ? setorToEdit.setorSuperior.id : '',
            });
        } else if (isNewMode) {
            setFormData(initialFormData);
        }
    }, [setorToEdit, mode, isEditMode, isViewMode, isNewMode, initialFormData]);

    const handleChange = (e) => {
        if (isViewMode) return; 
        
        const { id, value } = e.target;
        let newValue = value;

        if (id === 'nomeSetor') newValue = newValue.toUpperCase();

        setFormData(prev => ({ ...prev, [id]: newValue }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isViewMode) return; 

        if (isEditMode && (!setorToEdit || !setorToEdit.id)) {
            setErro("Erro técnico: ID do setor não encontrado.");
            return;
        }

        setIsSubmitting(true);
        setErro('');

        const dataToSend = { 
            nomeSetor: formData.nomeSetor,
            responsavel: formData.responsavel,
            descricao: formData.descricao,
            setorSuperior: formData.setorSuperiorId 
                ? { id: parseInt(formData.setorSuperiorId) } 
                : null
        };
        
        const method = isEditMode ? 'PUT' : 'POST';
        const url = isEditMode ? `/api/organograma/${setorToEdit.id}` : '/api/organograma';

        try {
            await sendData(url, method, dataToSend);
            setIsSubmitting(false);
            onSetorSaved(isEditMode ? "Setor atualizado!" : "Setor cadastrado!", 'success');
            onClose();
        } catch (error) {
            setIsSubmitting(false);
            setErro("Erro ao salvar. Verifique se o nome do setor já existe.");
        } 
    };

    const setoresDisponiveis = allSetores.filter(s => s.id !== setorToEdit?.id);

    return (
        <div className="modal-overlay">
            {isSubmitting && <LoadingOverlay message="Processando..." />}
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{isViewMode ? 'Detalhes do Setor' : isEditMode ? 'Editar Setor' : 'Novo Setor'}</h2>
                    <button className="modal-close-btn" onClick={onClose}><FaTimes /></button>
                </div>
                
                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group full-width">
                            <label htmlFor="nomeSetor">Nome do Setor</label>
                            <input 
                                type="text" 
                                id="nomeSetor" 
                                value={formData.nomeSetor} 
                                onChange={handleChange} 
                                required 
                                disabled={isViewMode}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="responsavel">Gestor(a) Responsável</label>
                            <input 
                                type="text" 
                                id="responsavel" 
                                value={formData.responsavel} 
                                onChange={handleChange} 
                                required 
                                disabled={isViewMode}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="setorSuperiorId">Setor Superior (Pai)</label>
                            <select 
                                id="setorSuperiorId" 
                                value={formData.setorSuperiorId} 
                                onChange={handleChange}
                                disabled={isViewMode}
                            >
                                <option value="">Nenhum (Setor Raiz)</option>
                                {setoresDisponiveis.map(s => (
                                    <option key={s.id} value={s.id}>{s.nomeSetor}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="descricao">Descrição/Observações</label>
                            <textarea 
                                id="descricao" 
                                value={formData.descricao} 
                                onChange={handleChange} 
                                rows="3" 
                                disabled={isViewMode}
                                style={{ resize: 'none' }} // Evita que o usuário quebre o layout do modal
                            />
                        </div>

                        {erro && <p className="error-message full-width" style={{color: '#e53e3e', fontSize: '0.85rem'}}>{erro}</p>}
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            {isViewMode ? 'Fechar' : 'Cancelar'}
                        </button>
                        {!isViewMode && (
                            <button type="submit" className="btn-save">
                                {isEditMode ? 'Salvar Alterações' : 'Cadastrar Setor'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SetorModal;








/*

import React, { useState, useEffect, useMemo } from 'react';
import LoadingOverlay from '../loadingoverlay/LoadingOverlay'; 
import { sendData } from '../../service/api';
import { FaTimes } from 'react-icons/fa';

const SetorModal = ({ onClose, onSetorSaved, setorToEdit, mode, allSetores }) => {

    const isViewMode = mode === 'view';
    const isEditMode = mode === 'edit';
    const isNewMode = mode === 'new';
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [erro, setErro] = useState('');

    const initialFormData = useMemo(() => ({
        nomeSetor: '',
        responsavel: '',
        descricao: '',
        setorSuperiorId: '', // Usado apenas para o select
    }), []);

    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        if (setorToEdit && (isEditMode || isViewMode)) {
            setFormData({
                nomeSetor: setorToEdit.nomeSetor || '',
                responsavel: setorToEdit.responsavel || '',
                descricao: setorToEdit.descricao || '',
                // Se o Java enviou setorSuperior, pegamos o ID dele para o select
                setorSuperiorId: setorToEdit.setorSuperior ? setorToEdit.setorSuperior.id : '',
            });
        } else if (isNewMode) {
            setFormData(initialFormData);
        }
    }, [setorToEdit, mode, isEditMode, isViewMode, isNewMode, initialFormData]);

    const handleChange = (e) => {
        if (isViewMode) return; 
        
        const { id, value } = e.target;
        let newValue = value;

        if (id === 'nomeSetor') newValue = newValue.toUpperCase();

        setFormData(prev => ({ ...prev, [id]: newValue }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isViewMode) return; 

        if (isEditMode && (!setorToEdit || !setorToEdit.id)) {
            setErro("Erro técnico: ID do setor não encontrado.");
            return;
        }

        setIsSubmitting(true);
        setErro('');

        // MAPEAMENTO PARA O BACKEND (Padronizando com a Entity Organograma.java)
        const dataToSend = { 
            nomeSetor: formData.nomeSetor,
            responsavel: formData.responsavel,
            descricao: formData.descricao,
            // O Java espera um objeto para o relacionamento ManyToOne
            setorSuperior: formData.setorSuperiorId 
                ? { id: parseInt(formData.setorSuperiorId) } 
                : null
        };
        
        const method = isEditMode ? 'PUT' : 'POST';
        const url = isEditMode ? `/api/organograma/${setorToEdit.id}` : '/api/organograma';

        try {
            await sendData(url, method, dataToSend);
            setIsSubmitting(false);
            onSetorSaved(isEditMode ? "Setor atualizado!" : "Setor cadastrado!", 'success');
            onClose();
        } catch (error) {
            setIsSubmitting(false);
            setErro("Erro ao salvar. Verifique se o nome do setor já existe.");
        } 
    };

    // Filtra para evitar que um setor seja pai de si mesmo
    const setoresDisponiveis = allSetores.filter(s => s.id !== setorToEdit?.id);

    const renderViewMode = () => (
        <div className="view-mode-details form-grid">
            <div className="form-group full-width"><label>Nome do Setor</label><p>{formData.nomeSetor}</p></div>
            <div className="form-group"><label>Gestor(a)</label><p>{formData.responsavel}</p></div>
            <div className="form-group">
                <label>Setor Superior</label>
                <p>{setorToEdit?.setorSuperior ? setorToEdit.setorSuperior.nomeSetor : 'Secretaria/Raiz'}</p>
            </div>
            <div className="form-group full-width"><label>Descrição</label><p>{formData.descricao || 'Sem descrição'}</p></div>
        </div>
    );

    return (
        <div className="modal-overlay">
            {isSubmitting && <LoadingOverlay message="Processando..." />}
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{isViewMode ? 'Detalhes do Setor' : isEditMode ? 'Editar Setor' : 'Novo Setor'}</h2>
                    <button className="modal-close-btn" onClick={onClose}><FaTimes /></button>
                </div>
                
                {isViewMode ? renderViewMode() : (
                    <form className='form-grid-principal' onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label htmlFor="nomeSetor">Nome do Setor</label>
                                <input type="text" id="nomeSetor" value={formData.nomeSetor} onChange={handleChange} required />
                            </div>

                            <div className="form-group">
                                <label htmlFor="responsavel">Gestor(a) Responsável</label>
                                <input type="text" id="responsavel" value={formData.responsavel} onChange={handleChange} required />
                            </div>

                            <div className="form-group">
                                <label htmlFor="setorSuperiorId">Setor Superior (Pai)</label>
                                <select id="setorSuperiorId" value={formData.setorSuperiorId} onChange={handleChange}>
                                    <option value="">Nenhum (Setor Raiz)</option>
                                    {setoresDisponiveis.map(s => (
                                        <option key={s.id} value={s.id}>{s.nomeSetor}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group full-width">
                                <label htmlFor="descricao">Descrição/Observações</label>
                                <textarea id="descricao" value={formData.descricao} onChange={handleChange} rows="3" />
                            </div>

                            {erro && <p className="error-message full-width" style={{color: 'red', fontSize: '0.9rem'}}>{erro}</p>}
                        </div>

                        <div className="modal-actions">
                            <button type="button" onClick={onClose}>Cancelar</button>
                            <button type="submit" className="btn-salvar">
                                {isEditMode ? 'Salvar Alterações' : 'Cadastrar Setor'}
                            </button>
                        </div>
                    </form>
                )}

                {isViewMode && (
                    <div className="modal-actions">
                        <button type="button" onClick={onClose}>Fechar</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SetorModal;


*/













/*

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
                nomeSetor: setorData.nomeSetor || '',
                responsavel: setorData.responsavel || '',
            });
        } else {
             // Resetar para valores vazios ao abrir para novo cadastro
             setFormData({ pai: '', descricao: '', nomeSetor: '', responsavel: '' });
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
                    
                    {/* Linha 1: Nome do Setor 
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
                    
                    {/* Linha 2: Setor Pai e Responsável 
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

                    {/* Linha 3: Descrição 
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

*/