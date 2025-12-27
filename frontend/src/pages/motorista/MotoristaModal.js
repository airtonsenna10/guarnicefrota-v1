import React, { useState, useEffect, useMemo } from 'react';
import LoadingOverlay from '../loadingoverlay/LoadingOverlay'; 
import { sendData, fetchData } from '../../service/api'; // Importado fetchData
import { FaTimes, FaUserAlt } from 'react-icons/fa';

const MotoristaModal = ({ onClose, onSaved, motoristaToEdit, mode }) => {
    const isViewMode = mode === 'view';
    const isEditMode = mode === 'edit';
    const isNewMode = mode === 'new';
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [erro, setErro] = useState('');
    
    // Estados para busca de servidores
    const [servidores, setServidores] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const initialFormData = useMemo(() => ({
        id_servidor: '', // Armazena a FK
        nome: '',
        cnh_numero: '',
        categoria_cnh: '',
        validade_cnh: '',
        status: 'Disponivel'
    }), []);

    const [formData, setFormData] = useState(initialFormData);

    // Carregar lista de servidores para a busca
    useEffect(() => {
        const carregarServidores = async () => {
            try {
                const dados = await fetchData('/api/servidor'); // Endpoint que retorna servidores
                setServidores(dados);
            } catch (err) {
                console.error("Erro ao carregar servidores:", err);
            }
        };
        if (!isViewMode) carregarServidores();
    }, [isViewMode]);

    useEffect(() => {
        if (motoristaToEdit && (isEditMode || isViewMode)) {
            setFormData({
                id_servidor: motoristaToEdit.servidor?.id || '',
                nome: motoristaToEdit.servidor?.pessoa?.nome || motoristaToEdit.nome || '',
                cnh_numero: motoristaToEdit.cnh || '', // Ajustado para bater com o Java 'cnh'
                categoria_cnh: motoristaToEdit.categoriaCnh || '', // Ajustado para camelCase do Java
                validade_cnh: motoristaToEdit.validadeCnh || '',
                status: motoristaToEdit.status || 'Disponivel',
            });
            setSearchTerm(motoristaToEdit.servidor?.pessoa?.nome || motoristaToEdit.nome || '');
        } else if (isNewMode) {
            setFormData(initialFormData);
            setSearchTerm('');
        }
    }, [motoristaToEdit, mode, isEditMode, isViewMode, isNewMode, initialFormData]);

    // Lógica de Filtro
    const servidoresFiltrados = useMemo(() => {
        const term = searchTerm?.toLowerCase() || '';
        if (term.length === 0 || !showSuggestions) return [];
        return servidores.filter(s => 
            (s.pessoa?.nome || s.nome || '').toLowerCase().includes(term)
        );
    }, [searchTerm, servidores, showSuggestions]);

    const handleSelectServidor = (servidor) => {
        const nome = servidor.pessoa?.nome || servidor.nome;
        setFormData(prev => ({ 
            ...prev, 
            id_servidor: servidor.id,
            nome: nome 
        }));
        setSearchTerm(nome);
        setShowSuggestions(false);
    };

    const handleChange = (e) => {
        if (isViewMode) return; 
        const { id, value } = e.target;
        
        if (id === 'nome') {
            setSearchTerm(value);
            setShowSuggestions(true);
        } else {
            setFormData(prev => ({ ...prev, [id]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.id_servidor && isNewMode) {
            setErro("Selecione um servidor da lista.");
            return;
        }

        setIsSubmitting(true);
        setErro('');

        // Montagem do objeto estruturado para o Java
        const dataToSend = {
            servidor: { id: formData.id_servidor }, // fk_idservidor
            nome: formData.nome,
            cnh: formData.cnh_numero,
            categoriaCnh: formData.categoria_cnh,
            validadeCnh: formData.validade_cnh,
            status: formData.status,
            observacao: motoristaToEdit?.observacao || ""
        };

        const method = isEditMode ? 'PUT' : 'POST';
        const url = isEditMode ? `/api/motorista/${motoristaToEdit.id}` : '/api/motorista';

        try {
            await sendData(url, method, dataToSend);
            setIsSubmitting(false);
            onSaved(isEditMode ? "Motorista atualizado!" : "Motorista cadastrado!", 'success');
            onClose();
        } catch (error) {
            setIsSubmitting(false);
            //setErro("Erro ao salvar motorista. Verifique os dados e a validade da CNH.");
            const msgErro = error.response?.data || "Verifique se a CNH já existe ou se os dados são válidos.";
            setErro(`Erro ao salvar: ${msgErro}`);
            //console.error("Erro na requisição:", error);
        } 
    };

    return (
        <div className="modal-overlay">
            {isSubmitting && <LoadingOverlay message="Processando..." />}
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{isViewMode ? 'Detalhes' : isEditMode ? 'Editar' : 'Novo Motorista'}</h2>
                    <button className="modal-close-btn" onClick={onClose}><FaTimes /></button>
                </div>
                
                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-grid">
                        {/* Busca de Servidor */}
                        <div className="form-group full-width" style={{ position: 'relative' }}>
                            <label>Nome do Servidor (Buscar)</label>
                            <div className="input-with-icon">
                                <input 
                                    type="text" id="nome" 
                                    value={searchTerm} 
                                    onChange={handleChange} 
                                    onFocus={() => setShowSuggestions(true)}
                                    onBlur={() => setTimeout(() => setShowSuggestions(false), 300)}
                                    required disabled={isViewMode || isEditMode} 
                                    autoComplete="off"
                                    placeholder="Digite o nome do servidor..."
                                />
                                <FaUserAlt className="input-icon" />
                            </div>
                            {showSuggestions && servidoresFiltrados.length > 0 && (
                                <ul className="autocomplete-suggestions">
                                    {servidoresFiltrados.map(s => (
                                        <li key={s.id} onClick={() => handleSelectServidor(s)}>
                                            {s.pessoa?.nome || s.nome} <small>(Matrícula: {s.matricula})</small>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="form-divider"><h3>Documentação CNH</h3></div>

                        <div className="form-group">
                            <label htmlFor="cnh_numero">Número da CNH</label>
                            <input type="text" id="cnh_numero" value={formData.cnh_numero} onChange={handleChange} required disabled={isViewMode} />
                        </div>

                        <div className="form-group">
                            <label htmlFor="categoria_cnh">Categoria</label>
                            <select id="categoria_cnh" value={formData.categoria_cnh} onChange={handleChange} required disabled={isViewMode}>
                                <option value="">Selecione</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="AB">AB</option>
                                <option value="C">C</option>
                                <option value="D">D</option>
                                <option value="E">E</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="validade_cnh">Validade CNH</label>
                            <input type="date" id="validade_cnh" value={formData.validade_cnh} onChange={handleChange} required disabled={isViewMode} />
                        </div>

                        <div className="form-group">
                            <label htmlFor="status">Status Operacional</label>
                            <select id="status" value={formData.status} onChange={handleChange} disabled={isViewMode}>
                                <option value="Disponivel">Disponível</option>
                                <option value="Em Viagem">Em Viagem</option>
                                <option value="Indisponivel">Indisponível</option>
                            </select>
                        </div>

                        {erro && <p className="error-message full-width">{erro}</p>}
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            {isViewMode ? 'Fechar' : 'Cancelar'}
                        </button>
                        {!isViewMode && (
                            <button type="submit" className="btn-save">
                                {isEditMode ? 'Salvar Alterações' : 'Cadastrar Motorista'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MotoristaModal;






/*

import React, { useState, useEffect, useMemo } from 'react';
import LoadingOverlay from '../loadingoverlay/LoadingOverlay'; 
import { sendData } from '../../service/api';
import { FaTimes } from 'react-icons/fa';

const MotoristaModal = ({ onClose, onSaved, motoristaToEdit, mode }) => {

    const isViewMode = mode === 'view';
    const isEditMode = mode === 'edit';
    const isNewMode = mode === 'new';
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [erro, setErro] = useState('');

    const initialFormData = useMemo(() => ({
        nome: '',
        cpf: '',
        email: '',
        telefone: '',
        cnh_numero: '',
        categoria_cnh: '',
        validade_cnh: '',
        status: 'Disponivel'
    }), []);

    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        if (motoristaToEdit && (isEditMode || isViewMode)) {
            setFormData({
                nome: motoristaToEdit.nome || '',
                cpf: motoristaToEdit.cpf || '',
                email: motoristaToEdit.email || '',
                telefone: motoristaToEdit.telefone || '',
                cnh_numero: motoristaToEdit.cnh_numero || '',
                categoria_cnh: motoristaToEdit.categoria_cnh || '',
                validade_cnh: motoristaToEdit.validade_cnh || '',
                status: motoristaToEdit.status || 'Disponivel',
            });
        } else if (isNewMode) {
            setFormData(initialFormData);
        }
    }, [motoristaToEdit, mode, isEditMode, isViewMode, isNewMode, initialFormData]);

    const handleChange = (e) => {
        if (isViewMode) return; 
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isViewMode) return; 

        setIsSubmitting(true);
        setErro('');

        const method = isEditMode ? 'PUT' : 'POST';
        const url = isEditMode ? `/api/motoristas/${motoristaToEdit.id_motorista}` : '/api/motoristas';

        try {
            await sendData(url, method, formData);
            setIsSubmitting(false);
            onSaved(isEditMode ? "Motorista atualizado!" : "Motorista cadastrado!", 'success');
            onClose();
        } catch (error) {
            setIsSubmitting(false);
            setErro("Erro ao salvar dados do motorista. Verifique os campos.");
        } 
    };

    return (
        <div className="modal-overlay">
            {isSubmitting && <LoadingOverlay message="Processando..." />}
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{isViewMode ? 'Detalhes do Motorista' : isEditMode ? 'Editar Motorista' : 'Novo Motorista'}</h2>
                    <button className="modal-close-btn" onClick={onClose}><FaTimes /></button>
                </div>
                
                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-grid">
                        {/* Seção Dados Pessoais 
                        <div className="form-group full-width">
                            <label htmlFor="nome">Nome Completo</label>
                            <input type="text" id="nome" value={formData.nome} onChange={handleChange} required disabled={isViewMode} />
                        </div>

                        {/* Seção de Habilitação 
                        <div className="form-divider">
                            <h3>Documentação CNH</h3>
                        </div>

                        <div className="form-group">
                            <label htmlFor="cnh_numero">Número da CNH</label>
                            <input type="text" id="cnh_numero" value={formData.cnh_numero} onChange={handleChange} required disabled={isViewMode} />
                        </div>

                        <div className="form-group">
                            <label htmlFor="categoria_cnh">Categoria</label>
                            <select id="categoria_cnh" value={formData.categoria_cnh} onChange={handleChange} required disabled={isViewMode}>
                                <option value="">Selecione</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="AB">AB</option>
                                <option value="C">C</option>
                                <option value="D">D</option>
                                <option value="E">E</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="validade_cnh">Validade CNH</label>
                            <input type="date" id="validade_cnh" value={formData.validade_cnh} onChange={handleChange} required disabled={isViewMode} />
                        </div>

                        <div className="form-group">
                            <label htmlFor="status">Status Operacional</label>
                            <select id="status" value={formData.status} onChange={handleChange} disabled={isViewMode}>
                                <option value="Disponivel">Disponível</option>
                                <option value="Em Viagem">Em Viagem</option>
                                <option value="Ferias">Férias</option>
                                <option value="Indisponivel">Indisponível</option>
                            </select>
                        </div>

                        {erro && <p className="error-message full-width" style={{color: '#e53e3e', fontSize: '0.85rem'}}>{erro}</p>}
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            {isViewMode ? 'Fechar' : 'Cancelar'}
                        </button>
                        {!isViewMode && (
                            <button type="submit" className="btn-save">
                                {isEditMode ? 'Salvar Alterações' : 'Cadastrar Motorista'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MotoristaModal;


*/














/*

import React, { useState, useEffect } from 'react';
import { sendData } from '../../service/api'; 
//import './MotoristaModal.css'; 

const MotoristaModal = ({ isOpen, onClose, motoristaData }) => {
    // Inicializa o estado com base na sua entidade Motorista
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        telefone: '',
        status: 'ATIVO',
        cnh_numero: '',
        cnh_categoria: '',
        cnh_vencimento: '', // Formato YYYY-MM-DD
        // Se motorista é uma FK de Servidor, adicione fk_idservidor aqui
    });
    
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (motoristaData) {
            // Preenche o formulário para edição
            setFormData({
                nome: motoristaData.nome || '',
                email: motoristaData.email || '',
                telefone: motoristaData.telefone || '',
                status: motoristaData.status || 'ATIVO',
                cnh_numero: motoristaData.cnh_numero || '',
                cnh_categoria: motoristaData.cnh_categoria || '',
                // Converte a data de vencimento para o formato do input date
                cnh_vencimento: motoristaData.cnh_vencimento ? 
                    new Date(motoristaData.cnh_vencimento).toISOString().substring(0, 10) : '',
            });
        }
    }, [motoristaData]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const method = motoristaData ? 'PUT' : 'POST';
        const endpoint = motoristaData 
            ? `motoristas/${motoristaData.id_motorista}` 
            : 'motoristas';

        try {
            await sendData(method, endpoint, formData);
            onClose(); 
        } catch (error) {
            console.error("Erro ao salvar motorista:", error);
            alert("Erro ao salvar motorista. Verifique o console.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{motoristaData ? 'Editar Motorista' : 'Novo Motorista'}</h2>
                <form onSubmit={handleSubmit}>
                    
                    <div className="form-group">
                        <label htmlFor="nome">Nome Completo</label>
                        <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="telefone">Telefone</label>
                            <input type="text" id="telefone" name="telefone" value={formData.telefone} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">E-mail</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
                        </div>
                    </div>
                    
                    <h3>Detalhes CNH</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="cnh_numero">Nº CNH</label>
                            <input type="text" id="cnh_numero" name="cnh_numero" value={formData.cnh_numero} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="cnh_categoria">Categoria</label>
                            <input type="text" id="cnh_categoria" name="cnh_categoria" value={formData.cnh_categoria} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="cnh_vencimento">Vencimento</label>
                            <input type="date" id="cnh_vencimento" name="cnh_vencimento" value={formData.cnh_vencimento} onChange={handleChange} required />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="status">Status Atual</label>
                        <select id="status" name="status" value={formData.status} onChange={handleChange} required>
                            <option value="ATIVO">ATIVO</option>
                            <option value="EM VIAGEM">EM VIAGEM</option>
                            <option value="FÉRIAS">FÉRIAS</option>
                            <option value="INATIVO">INATIVO</option>
                        </select>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-cancelar" onClick={onClose} disabled={loading}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-salvar" disabled={loading}>
                            {loading ? 'Salvando...' : (motoristaData ? 'Atualizar' : 'Cadastrar')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MotoristaModal;

*/