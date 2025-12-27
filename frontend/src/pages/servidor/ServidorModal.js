import React, { useState, useEffect, useMemo } from 'react';
import { sendData, fetchData } from '../../service/api';
import { FaTimes, FaUserAlt } from 'react-icons/fa';
import LoadingOverlay from '../loadingoverlay/LoadingOverlay'; 

const ServidorModal = ({ onClose, onSaveSuccess, servidorToEdit, mode }) => {
    const isViewMode = mode === 'view';
    const isEditMode = mode === 'edit';

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [setores, setSetores] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const initialFormData = useMemo(() => ({
        nome: '',
        fk_pessoa: '',
        matricula: '',
        fk_setor: '',
        tipo: 'Servidor',
        situacao: 'Ativo',
    }), []);

    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        const carregarDadosIniciais = async () => {
            try {
                const [dadosSetores, dadosUsuarios] = await Promise.all([
                    fetchData('/api/organograma'),
                    fetchData('/api/pessoas')
                ]);
                setSetores(dadosSetores);
                setUsuarios(dadosUsuarios);
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            }
        };
        carregarDadosIniciais();
    }, []);

    useEffect(() => {
        if (servidorToEdit && (isEditMode || isViewMode)) {
            setFormData({
                nome: servidorToEdit.pessoa?.nome,
                fk_pessoa: servidorToEdit.pessoa?.id || servidorToEdit.fk_pessoa || '',
                matricula: servidorToEdit.matricula || '',
                fk_setor: servidorToEdit.setor?.id || '', 
                tipo: servidorToEdit.tipo || 'Servidor',
                situacao: servidorToEdit.situacao || 'Ativo',
            });
            setSearchTerm(servidorToEdit.pessoa?.nome);
        } else {
            setFormData(initialFormData);
            setSearchTerm('');
        }
    }, [servidorToEdit, mode, isEditMode, isViewMode, initialFormData]);

   
    const usuariosFiltrados = useMemo(() => {
        if (!searchTerm) return [];
        return usuarios.filter(user => {
            // Tenta buscar o nome em 'pessoa.nome' ou direto em 'nome'
            const nomeParaFiltrar = user.pessoa?.nome || user.nome || '';
            return nomeParaFiltrar.toLowerCase().includes(searchTerm.toLowerCase());
        });
    }, [searchTerm, usuarios]);


    const handleSelectUsuario = (user) => {
        const nomeSelecionado = user.pessoa?.nome || user.nome;
        const idSelecionado = user.id;

        setFormData(prev => ({ 
            ...prev, 
            nome: nomeSelecionado, 
            fk_pessoa: idSelecionado 
        }));
        
        setSearchTerm(nomeSelecionado);
        setShowSuggestions(false);
    };



    const handleChange = (e) => {
        if (isViewMode) return;
        const { name, value } = e.target;
        if (name === 'nome') {
            setSearchTerm(value);
            setFormData(prev => ({ ...prev, nome: value })); // Atualiza o que será enviado no JSON
            setShowSuggestions(true);
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // Envio do formulário
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.fk_pessoa) {
            alert("Selecione um usuário da lista.");
            return;
        }

        setIsSubmitting(true);
        const dataToSend = {
            id: isEditMode ? servidorToEdit.id : null, // Garante o ID na edição
            matricula: formData.matricula,
            cargo: '',
            tipo: formData.tipo,
            situacao: formData.situacao,
            pessoa: {
                 id: formData.fk_pessoa,
                 nome: searchTerm,
            },
            setor: { id: formData.fk_setor }
        };

        const method = isEditMode ? 'PUT' : 'POST';
        const endpoint = isEditMode ? `/api/servidor/${servidorToEdit.id}` : '/api/servidor';

        try {
            await sendData(endpoint, method, dataToSend);
            setIsSubmitting(false);
            onSaveSuccess(isEditMode ? "Atualizado com sucesso!" : "Cadastrado com sucesso!", 'success');
            onClose();
        } catch (error) {
            setIsSubmitting(false);
            onSaveSuccess("Erro ao salvar colaborador.", 'error');
        }
    };

    return (
        <div className="modal-overlay">
            {isSubmitting && <LoadingOverlay message="Processando..." />}
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{isViewMode ? 'Dados do Colaborador' : isEditMode ? 'Editar Colaborador' : 'Novo Colaborador'}</h2>
                    <button className="modal-close-btn" onClick={onClose}><FaTimes /></button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-grid">
                        {/* Campo de Busca - Ocupa 2 colunas para facilitar a leitura */}
                        <div className="form-group" style={{ gridColumn: 'span 2', position: 'relative' }}>
                            <label>Nome (Buscar no sistema)</label>
                            <div className="input-with-icon" style={{ position: 'relative' }}>
                                <input 
                                    type="text" 
                                    name="nome" 
                                    value={searchTerm} 
                                    onChange={handleChange}
                                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                    onFocus={() => setShowSuggestions(true)}
                                    autoComplete="off"
                                    placeholder="Digite para buscar..."
                                    required 
                                    disabled={isViewMode}
                                />
                                <FaUserAlt className="input-icon"  />
                            </div>
                            {showSuggestions && searchTerm.length > 0 && !isViewMode && (
                                <ul className="autocomplete-suggestions">
                                    {usuariosFiltrados.map(user => (
                                        <li key={user.id} onClick={() => handleSelectUsuario(user)}>
                                            {user.nome} <small>({user.email})</small>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Matrícula</label>
                            <input type="text" name="matricula" value={formData.matricula} onChange={handleChange} required disabled={isViewMode} />
                        </div>

                        <div className="form-group">
                            <label>Vínculo / Perfil</label>
                            <select name="tipo" value={formData.tipo} onChange={handleChange} disabled={isViewMode}>
                                <option value="Servidor">Servidor</option>
                                <option value="Terceirizado">Terceirizado</option>
                                <option value="Estagiario">Estagiário</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Setor</label>
                            <select name="fk_setor" value={formData.fk_setor} onChange={handleChange} required disabled={isViewMode}>
                                <option value="">Selecione...</option>
                                {setores.map(s => <option key={s.id} value={s.id}>{s.nomeSetor}</option>)}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Status</label>
                            <select name="situacao" value={formData.situacao} onChange={handleChange} disabled={isViewMode}>
                                <option value="Ativo">Ativo</option>
                                <option value="Inativo">Inativo</option>
                            </select>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            {isViewMode ? 'Fechar' : 'Cancelar'}
                        </button>
                        {!isViewMode && (
                            <button type="submit" className="btn-save">
                                {isEditMode ? 'Salvar Edição' : 'Cadastrar Colaborador'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ServidorModal;




/*


import React, { useState, useEffect, useMemo } from 'react';
import { sendData, fetchData } from '../../service/api';
import { FaTimes, FaUserAlt } from 'react-icons/fa';
import LoadingOverlay from '../loadingoverlay/LoadingOverlay'; 

const ServidorModal = ({ onClose, onSaveSuccess, servidorToEdit, mode }) => {
    const isViewMode = mode === 'view';
    const isEditMode = mode === 'edit';
    const isNewMode = mode === 'new';

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [setores, setSetores] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const initialFormData = useMemo(() => ({
        nome: '',
        fk_pessoa: '',
        matricula: '',
        fk_setor: '',
        tipo: 'Servidor',
        situacao: 'Ativo',
    }), []);

    const [formData, setFormData] = useState(initialFormData);

    // Carregar dados auxiliares
    useEffect(() => {
        const carregarDadosIniciais = async () => {
            try {
                const [dadosSetores, dadosUsuarios] = await Promise.all([
                    fetchData('/api/organograma'),
                    fetchData('/api/pessoas')
                ]);
                setSetores(dadosSetores);
                setUsuarios(dadosUsuarios);
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            }
        };
        carregarDadosIniciais();
    }, []);

    // Sincronizar formulário com servidorToEdit (Padrão UsuarioModal)
    useEffect(() => {
        if (servidorToEdit && (isEditMode || isViewMode)) {
            setFormData({
                nome: servidorToEdit.nome || '',
                fk_pessoa: servidorToEdit.pessoa?.id || servidorToEdit.fk_pessoa || '',
                matricula: servidorToEdit.matricula || '',
                fk_setor: servidorToEdit.setor?.id || '', 
                tipo: servidorToEdit.tipo || 'Servidor',
                situacao: servidorToEdit.situacao || 'Ativo',
            });
            setSearchTerm(servidorToEdit.nome || '');
        } else {
            setFormData(initialFormData);
            setSearchTerm('');
        }
    }, [servidorToEdit, mode, isEditMode, isViewMode, initialFormData]);

    const usuariosFiltrados = usuarios.filter(user => 
        user.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectUsuario = (user) => {
        setFormData(prev => ({ ...prev, nome: user.nome, fk_pessoa: user.id }));
        setSearchTerm(user.nome);
        setShowSuggestions(false);
    };

    const handleChange = (e) => {
        if (isViewMode) return;
        const { name, value } = e.target;
        if (name === 'nome') {
            setSearchTerm(value);
            setShowSuggestions(true);
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.fk_pessoa) {
            alert("Selecione um usuário da lista.");
            return;
        }

        setIsSubmitting(true);

        const dataToSend = {
            nome: formData.nome,
            matricula: formData.matricula,
            cargo: '',
            tipo: formData.tipo,
            situacao: formData.situacao,
            pessoa: { id: formData.fk_pessoa },
            setor: { id: formData.fk_setor }
        };

        const method = isEditMode ? 'PUT' : 'POST';
        const endpoint = isEditMode ? `/api/servidor/${servidorToEdit.id}` : '/api/servidor';

        try {
            await sendData(endpoint, method, dataToSend);
            setIsSubmitting(false);
            const mensagem = isEditMode ? "Atualizado com sucesso!" : "Cadastrado com sucesso!";
            onSaveSuccess(mensagem, 'success');
            onClose();
        } catch (error) {
            setIsSubmitting(false);
            onSaveSuccess("Erro ao salvar colaborador.", 'error');
        }
    };
    
    /*codigo removido
    const renderViewMode = () => (
        <div className="view-mode-details form-grid">
            <div className="form-group"><label>Nome</label><p>{formData.nome}</p></div>
            <div className="form-group"><label>Matricula</label><p>{formData.matricula}</p></div>
            <div className="form-group"><label>Setor</label><p>{setores.find(s => s.id === parseInt(formData.fk_setor))?.nomeSetor || 'N/A'}</p></div>
            <div className="form-group"><label>Perfil</label><p>{formData.tipo}</p></div>
            <div className="form-group"><label>Status</label><p>{formData.situacao}</p></div>
        </div>
    );
    


   // Renderização do Modo Visualização com estilo aprimorado
    const renderViewMode = () => (
        <div className="view-mode-container">
            <div className="form-grid">
                <div className="detail-item">
                    <label>Nome do Colaborador</label>
                    <span>{formData.nome}</span>
                </div>
                <div className="detail-item">
                    <label>Matrícula</label>
                    <span>{formData.matricula}</span>
                </div>
                <div className="detail-item">
                    <label>Setor</label>
                    <span>{setores.find(s => s.id === parseInt(formData.fk_setor))?.nomeSetor || 'N/A'}</span>
                </div>
                <div className="detail-item">
                    <label>Vínculo / Perfil</label>
                    <span>{formData.tipo}</span>
                </div>
                <div className="detail-item">
                    <label>Status</label>
                    <span className={`status-pill ${formData.situacao === 'Ativo' ? 'status-concluida' : 'status-cancelada'}`}>
                        {formData.situacao}
                    </span>
                </div>
            </div>
        </div>
    );





    return (
        <div className="modal-overlay">
            {isSubmitting && <LoadingOverlay message="Processando..." />}
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{isViewMode ? 'Dados do Colaborador' : isEditMode ? 'Editar Colaborador' : 'Novo Colaborador'}</h2>
                    <button className="modal-close-btn" onClick={onClose}><FaTimes /></button>
                </div>

                {isViewMode ? renderViewMode() : (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group" style={{ position: 'relative' }}>
                            <label>Nome do Usuário (Buscar no sistema)</label>
                            <div className="input-with-icon">
                                <input 
                                    type="text" 
                                    name="nome" 
                                    value={searchTerm} 
                                    onChange={handleChange}
                                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                    onFocus={() => setShowSuggestions(true)}
                                    autoComplete="off"
                                    placeholder="Digite para buscar..."
                                    required 
                                />
                                <FaUserAlt className="input-icon" />
                            </div>
                            {showSuggestions && searchTerm.length > 0 && (
                                <ul className="autocomplete-suggestions">
                                    {usuariosFiltrados.map(user => (
                                        <li key={user.id} onClick={() => handleSelectUsuario(user)}>
                                            {user.nome} <small>({user.email})</small>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Matrícula</label>
                                <input type="text" name="matricula" value={formData.matricula} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Perfil</label>
                                <select name="tipo" value={formData.tipo} onChange={handleChange}>
                                    <option value="Servidor">Servidor</option>
                                    <option value="Terceirizado">Terceirizado</option>
                                    <option value="Estagiario">Estagiário</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Setor</label>
                                <select name="fk_setor" value={formData.fk_setor} onChange={handleChange} required>
                                    <option value="">Selecione...</option>
                                    {setores.map(s => <option key={s.id} value={s.id}>{s.nomeSetor}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Status</label>
                                <select name="situacao" value={formData.situacao} onChange={handleChange}>
                                    <option value="Ativo">Ativo</option>
                                    <option value="Inativo">Inativo</option>
                                </select>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button type="button" onClick={onClose}>Cancelar</button>
                            <button type="submit" className="btn-salvar">
                                {isEditMode ? 'Salvar Edição' : 'Cadastrar Colaborador'}
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

export default ServidorModal;

*/




/*

import React, { useState, useEffect, useMemo } from 'react';
import { sendData, fetchData } from '../../service/api';
import { FaTimes, FaUserAlt } from 'react-icons/fa';
import './ServidorModal.css';
import LoadingOverlay from '../loadingoverlay/LoadingOverlay'; 

const ServidorModal = ({ isOpen, onClose, servidorData, mode, onSaveSuccess }) => {

    // --- VARIÁVEIS DE ESTADO E LÓGICA DE MODO ---
    const isViewMode = mode === 'view';
    const isEditMode = mode === 'edit';
    const isNewMode = mode === 'new';

    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [setores, setSetores] = useState([]);
    const [usuarios, setUsuarios] = useState([]); // Lista de usuários para busca
    const [searchTerm, setSearchTerm] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const initialFormData = useMemo(() => ({
        nome: '',
        fk_pessoa: '', // ID do usuário selecionado
        matricula: '',
        fk_setor: '',
        tipo: 'Servidor',
        situacao: 'Ativo',
    }), []);

    const [formData, setFormData] = useState(initialFormData);

    // Carregar Setores e Usuários ao abrir o modal
    useEffect(() => {
        const carregarDadosIniciais = async () => {
            try {
                const [dadosSetores, dadosUsuarios] = await Promise.all([
                    fetchData('/api/organograma'),
                    fetchData('/api/pessoas') // Ajuste o endpoint conforme seu backend
                ]);
                setSetores(dadosSetores);
                setUsuarios(dadosUsuarios);
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            }
        };
        if (isOpen) carregarDadosIniciais();
    }, [isOpen]);

    useEffect(() => {
        if (servidorData && (isEditMode || isViewMode)) {
            setFormData({
                nome: servidorData.nome || '',
                fk_pessoa: servidorData.pessoa?.id || servidorData.fk_pessoa || '',
                matricula: servidorData.matricula || '',
                fk_setor: servidorData.setor?.id || '', 
                tipo: servidorData.tipo || 'Servidor',
                situacao: servidorData.situacao || 'ativo',
            });
            setSearchTerm(servidorData.nome || '');
        } else if (isNewMode) {
            setFormData(initialFormData);
            setSearchTerm('');
        }
    }, [servidorData, mode, isOpen, isEditMode, isViewMode, isNewMode, initialFormData]);

    // Filtragem de usuários para o Autocomplete
    const usuariosFiltrados = usuarios.filter(user => 
        user.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectUsuario = (user) => {
        setFormData(prev => ({ 
            ...prev, 
            nome: user.nome, 
            fk_pessoa: user.id 
        }));
        setSearchTerm(user.nome);
        setShowSuggestions(false);
    };

    const handleChange = (e) => {
        if (isViewMode) return;
        const { name, value } = e.target;
        
        if (name === 'nome') {
            setSearchTerm(value);
            setShowSuggestions(true);
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.fk_pessoa) {
            alert("Por favor, selecione um usuário da lista.");
            return;
        }

        setIsSubmitting(true); // Inicia o estado de submissão

        // Prepara os dados para envio
        const dataToSend = {
            nome: formData.nome,
            matricula: formData.matricula,
            cargo: '', // Campo vazio ou ajuste conforme necessário
            tipo: formData.tipo,
            situacao: formData.situacao,
            pessoa: { id: formData.fk_pessoa }, // Relacionamento com Usuario
            setor: { id: formData.fk_setor }    // Relacionamento com Setor
        };

        const method = isEditMode ? 'PUT' : 'POST';
        const endpoint = isEditMode ? `/api/servidor/${servidorData.id}` : '/api/servidor';

        try {
            await sendData(endpoint, method, dataToSend);
            setIsSubmitting(false); // Resetando o estado de submissão
            onSaveSuccess(isEditMode ? "Atualizado com sucesso!" : "Cadastrado com sucesso!", 'success');
            onClose();
        } catch (error) {
            setIsSubmitting(false); // Resetando o estado de submissão
            onSaveSuccess("Erro ao salvar: Verifique se os dados estão corretos.", 'error');
            //alert("Erro ao salvar: Verifique se os dados estão corretos.");
        }
    };

    if (!isOpen) return null;

    // --- Renderização do Modo Visualização ---
    const renderViewMode = () => (
        <div className="view-mode-details form-grid">
            <div className="form-group"><label>Nome</label><p>{formData.nome}</p></div>
            <div className="form-group"><label>Matricula</label><p>{formData.matricula}</p></div>
            <div className="form-group"><label>Setor</label><p>{setores.find(s => s.id === parseInt(formData.fk_setor))?.nomeSetor || 'N/A'}</p></div>
            <div className="form-group"><label>Perfil</label><p>{formData.tipo}</p></div>
            <div className="form-group"><label>Status</label><p>{formData.situacao}</p></div>
        </div>
    );

    return (
        <div className="modal-overlay">
             {isSubmitting && <LoadingOverlay message="Processando..." />}
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{isViewMode ? 'Dados do Colaborador' : isEditMode ? 'Editar Colaborador' : 'Novo Colaborador'}</h2>
                    <button className="modal-close-btn" onClick={onClose}><FaTimes /></button>
                </div>
                {isViewMode ? renderViewMode() : (

                        <form onSubmit={handleSubmit}>
                            
                                <div className="form-group" style={{ position: 'relative' }}>
                                    <label>Nome do Usuário (Buscar no sistema)</label>
                                    <div className="input-with-icon">
                                        <input 
                                            type="text" 
                                            name="nome" 
                                            value={searchTerm} 
                                            onChange={handleChange}
                                            // Fecha a lista se o usuário apagar tudo
                                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                            onFocus={() => !isViewMode && setShowSuggestions(true)}
                                            autoComplete="off"
                                            placeholder="Digite o nome para buscar..."
                                            disabled={isViewMode}
                                            required 
                                        />
                                        <FaUserAlt className="input-icon" />
                                    </div>

                                    {/* Lista de Sugestões (Autocomplete) 
                                    {!isViewMode && showSuggestions && searchTerm.length > 0 && (
                                        <ul className="autocomplete-suggestions">
                                            {usuariosFiltrados.length > 0 ? (
                                                usuariosFiltrados.map(user => (
                                                    <li key={user.id} onClick={() => handleSelectUsuario(user)}>
                                                        {user.nome} <small>({user.email})</small>
                                                    </li>
                                                ))
                                            ) : (
                                                <li className="no-suggestion">Nenhum usuário encontrado</li>
                                            )}
                                        </ul>
                                    )}
                                </div>

                                {/* Restante dos campos (Matrícula, Perfil, Setor, Status) seguem iguais... 
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Matrícula</label>
                                        <input type="text" name="matricula" value={formData.matricula} onChange={handleChange} disabled={isViewMode} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Perfil</label>
                                        <select name="tipo" value={formData.tipo} onChange={handleChange} disabled={isViewMode}>
                                            <option value="Servidor">Servidor</option>
                                            <option value="Terceirizado">Terceirizado</option>
                                            <option value="Estagiario">Estagiário</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Setor</label>
                                        <select name="fk_setor" value={formData.fk_setor} onChange={handleChange} disabled={isViewMode} required>
                                            <option value="">Selecione...</option>
                                            {setores.map(s => <option key={s.id} value={s.id}>{s.nomeSetor}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Status</label>
                                        <select name="situacao" value={formData.situacao} onChange={handleChange} disabled={isViewMode}>
                                            <option value="Ativo">Ativo</option>
                                            <option value="Inativo">Inativo</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="modal-actions">
                                        <button type="button" onClick={onClose}>Cancelar</button>
                                        <button type="submit" className="btn-salvar">
                                            {isEditMode ? 'Salvar Edição' : 'Cadastrar Colaborador'}
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

export default ServidorModal;

*/


/*



import React, { useState, useEffect, useMemo } from 'react';
import { sendData, fetchData } from '../../service/api';
import { FaTimes, FaUserAlt } from 'react-icons/fa';
import './ServidorModal.css';

const ServidorModal = ({ isOpen, onClose, servidorData, mode, onSaveSuccess }) => {
    const isViewMode = mode === 'view';
    const isEditMode = mode === 'edit';
    const isNewMode = mode === 'new';

    const [loading, setLoading] = useState(false);
    const [setores, setSetores] = useState([]);
    const [usuarios, setUsuarios] = useState([]); // Lista de usuários para busca
    const [searchTerm, setSearchTerm] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const initialFormData = useMemo(() => ({
        nome: '',
        fk_pessoa: '', // ID do usuário selecionado
        matricula: '',
        fk_setor: '',
        tipo: 'Servidor',
        situacao: 'Ativo',
    }), []);

    const [formData, setFormData] = useState(initialFormData);

    // Carregar Setores e Usuários ao abrir o modal
    useEffect(() => {
        const carregarDadosIniciais = async () => {
            try {
                const [dadosSetores, dadosUsuarios] = await Promise.all([
                    fetchData('/api/organograma'),
                    fetchData('/api/pessoas') // Ajuste o endpoint conforme seu backend
                ]);
                setSetores(dadosSetores);
                setUsuarios(dadosUsuarios);
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            }
        };
        if (isOpen) carregarDadosIniciais();
    }, [isOpen]);

    useEffect(() => {
        if (servidorData && (isEditMode || isViewMode)) {
            setFormData({
                nome: servidorData.nome || '',
                fk_pessoa: servidorData.pessoa?.id || servidorData.fk_pessoa || '',
                matricula: servidorData.matricula || '',
                fk_setor: servidorData.setor?.id || '', 
                tipo: servidorData.tipo || 'Servidor',
                situacao: servidorData.situacao || 'ativo',
            });
            setSearchTerm(servidorData.nome || '');
        } else if (isNewMode) {
            setFormData(initialFormData);
            setSearchTerm('');
        }
    }, [servidorData, mode, isOpen, isEditMode, isViewMode, isNewMode, initialFormData]);

    // Filtragem de usuários para o Autocomplete
    const usuariosFiltrados = usuarios.filter(user => 
        user.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectUsuario = (user) => {
        setFormData(prev => ({ 
            ...prev, 
            nome: user.nome, 
            fk_pessoa: user.id 
        }));
        setSearchTerm(user.nome);
        setShowSuggestions(false);
    };

    const handleChange = (e) => {
        if (isViewMode) return;
        const { name, value } = e.target;
        
        if (name === 'nome') {
            setSearchTerm(value);
            setShowSuggestions(true);
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.fk_pessoa) {
            alert("Por favor, selecione um usuário da lista.");
            return;
        }


        setLoading(true);

        const payload = {
            nome: formData.nome,
            matricula: formData.matricula,
            cargo: '', // Campo vazio ou ajuste conforme necessário
            tipo: formData.tipo,
            situacao: formData.situacao,
            pessoa: { id: formData.fk_pessoa }, // Relacionamento com Usuario
            setor: { id: formData.fk_setor }    // Relacionamento com Setor
        };

        const method = isEditMode ? 'PUT' : 'POST';
        const endpoint = isEditMode ? `/api/servidor/${servidorData.id}` : '/api/servidor';

        try {
            await sendData(endpoint, method, payload);
            onSaveSuccess();
            onClose();
        } catch (error) {
            alert("Erro ao salvar: Verifique se os dados estão corretos.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{isViewMode ? 'Dados do Colaborador' : isEditMode ? 'Editar Colaborador' : 'Novo Colaborador'}</h2>
                    <button className="modal-close-btn" onClick={onClose}><FaTimes /></button>
                </div>

                <form onSubmit={handleSubmit}>
                    
                        <div className="form-group" style={{ position: 'relative' }}>
                            <label>Nome do Usuário (Buscar no sistema)</label>
                            <div className="input-with-icon">
                                <input 
                                    type="text" 
                                    name="nome" 
                                    value={searchTerm} 
                                    onChange={handleChange}
                                    // Fecha a lista se o usuário apagar tudo
                                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                    onFocus={() => !isViewMode && setShowSuggestions(true)}
                                    autoComplete="off"
                                    placeholder="Digite o nome para buscar..."
                                    disabled={isViewMode}
                                    required 
                                />
                                <FaUserAlt className="input-icon" />
                            </div>

                            {/* Lista de Sugestões (Autocomplete) 
                            {!isViewMode && showSuggestions && searchTerm.length > 0 && (
                                <ul className="autocomplete-suggestions">
                                    {usuariosFiltrados.length > 0 ? (
                                        usuariosFiltrados.map(user => (
                                            <li key={user.id} onClick={() => handleSelectUsuario(user)}>
                                                {user.nome} <small>({user.email})</small>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="no-suggestion">Nenhum usuário encontrado</li>
                                    )}
                                </ul>
                            )}
                        </div>

                        {/* Restante dos campos (Matrícula, Perfil, Setor, Status) seguem iguais... 
                        <div className="form-row">
                            <div className="form-group">
                                <label>Matrícula</label>
                                <input type="text" name="matricula" value={formData.matricula} onChange={handleChange} disabled={isViewMode} required />
                            </div>
                            <div className="form-group">
                                <label>Perfil</label>
                                <select name="tipo" value={formData.tipo} onChange={handleChange} disabled={isViewMode}>
                                    <option value="Servidor">Servidor</option>
                                    <option value="Terceirizado">Terceirizado</option>
                                    <option value="Estagiario">Estagiário</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Setor</label>
                                <select name="fk_setor" value={formData.fk_setor} onChange={handleChange} disabled={isViewMode} required>
                                    <option value="">Selecione...</option>
                                    {setores.map(s => <option key={s.id} value={s.id}>{s.nomeSetor}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Status</label>
                                <select name="situacao" value={formData.situacao} onChange={handleChange} disabled={isViewMode}>
                                    <option value="Ativo">Ativo</option>
                                    <option value="Inativo">Inativo</option>
                                </select>
                            </div>
                        </div>

                        <div className="modal-actions">
                                <button type="button" onClick={onClose}>Cancelar</button>
                                <button type="submit" className="btn-salvar">
                                    {isEditMode ? 'Salvar Edição' : 'Cadastrar Colaborador'}
                                </button>
                        </div>
                        {isViewMode && (
                        <div className="modal-actions">
                            <button type="button" onClick={onClose}>Fechar</button>
                        </div>
                        )}

                    

                </form>
            </div>
        </div>
    );
};

export default ServidorModal;

*/













/*

import React, { useState, useEffect, useMemo } from 'react';
import { sendData, fetchData } from '../../service/api';
import { FaTimes } from 'react-icons/fa';
//import './ServidorModal.css';

const ServidorModal = ({ isOpen, onClose, servidorData, mode, onSaveSuccess }) => {
    
    const isViewMode = mode === 'view';
    const isEditMode = mode === 'edit';
    const isNewMode = mode === 'new';

    const [loading, setLoading] = useState(false);
    const [setores, setSetores] = useState([]);

    const initialFormData = useMemo(() => ({
        nome: '',
        matricula: '',
        fk_setor: '',
        tipo: 'Servidor',
        situacao: 'ativo',
    }), []);

    const [formData, setFormData] = useState(initialFormData);

    // Carregar setores da API Organograma
    useEffect(() => {
        const carregarSetores = async () => {
            try {
                const data = await fetchData('/api/organograma');
                setSetores(data);
            } catch (error) {
                console.error("Erro ao carregar setores:", error);
            }
        };
        if (isOpen) carregarSetores();
    }, [isOpen]);

    // Sincronizar dados quando o modal abre ou o servidor selecionado muda
    useEffect(() => {
        if (servidorData && (isEditMode || isViewMode)) {
            setFormData({
                nome: servidorData.nome || '',
                matricula: servidorData.matricula || '',
                fk_setor: servidorData.setor?.id || '', 
                tipo: servidorData.tipo || 'Servidor',
                situacao: servidorData.situacao || 'ativo',
            });
        } else if (isNewMode) {
            setFormData(initialFormData);
        }
    }, [servidorData, mode, isOpen, isEditMode, isViewMode, isNewMode, initialFormData]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        if (isViewMode) return;
        const { name, value } = e.target;
        // Se quiser forçar maiúsculas como no UsuarioModal:
        const newValue = name === 'nome' ? value.toUpperCase() : value;
        setFormData(prev => ({ ...prev, [name]: newValue }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isViewMode) return;

        setLoading(true);
        const payload = {
            ...formData,
            setor: { id: formData.fk_setor }
        };

        const method = isEditMode ? 'PUT' : 'POST';
        const endpoint = isEditMode ? `/api/servidor/${servidorData.id}` : '/api/servidor';

        try {
            await sendData(method, endpoint, payload);
            onSaveSuccess();
            onClose();
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert("Erro ao processar solicitação.");
        } finally {
            setLoading(false);
        }
    };

    // Função que renderiza apenas os dados (Texto Puro)
    const renderViewMode = () => (
        <div className="view-mode-details">
            <div className="form-group"><label>Nome</label><p>{formData.nome}</p></div>
            <div className="form-row">
                <div className="form-group"><label>Matrícula</label><p>{formData.matricula}</p></div>
                <div className="form-group"><label>Perfil</label><p>{formData.tipo}</p></div>
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label>Setor</label>
                    <p>{setores.find(s => s.id === parseInt(formData.fk_setor))?.nomeSetor || 'Não informado'}</p>
                </div>
                <div className="form-group"><label>Status</label><p>{formData.situacao.toUpperCase()}</p></div>
            </div>
        </div>
    );

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{isViewMode ? 'Dados do Colaborador' : isEditMode ? 'Editar Colaborador' : 'Novo Colaborador'}</h2>
                    <button className="modal-close-btn" onClick={onClose}><FaTimes /></button>
                </div>

                {isViewMode ? (
                    <>
                        {renderViewMode()}
                        <div className="modal-actions">
                            <button type="button" className="btn-cancelar" onClick={onClose}>Fechar</button>
                        </div>
                    </>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="nome">Nome Completo</label>
                            <input type="text" name="nome" value={formData.nome} onChange={handleChange} required />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="matricula">Matrícula</label>
                                <input type="text" name="matricula" value={formData.matricula} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="tipo">Perfil</label>
                                <select name="tipo" value={formData.tipo} onChange={handleChange}>
                                    <option value="Servidor">Servidor</option>
                                    <option value="Terceirizado">Terceirizado</option>
                                    <option value="Comissionado">Comissionado</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="fk_setor">Setor</label>
                                <select name="fk_setor" value={formData.fk_setor} onChange={handleChange} required>
                                    <option value="">Selecione...</option>
                                    {setores.map(s => (
                                        <option key={s.id} value={s.id}>{s.nomeSetor}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="situacao">Status</label>
                                <select name="situacao" value={formData.situacao} onChange={handleChange}>
                                    <option value="ativo">Ativo</option>
                                    <option value="inativo">Inativo</option>
                                </select>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button type="button" className="btn-cancelar" onClick={onClose}>Cancelar</button>
                            <button type="submit" className="btn-salvar" disabled={loading}>
                                {loading ? 'Salvando...' : isEditMode ? 'Salvar Edição' : 'Cadastrar'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ServidorModal;


*/






/*

import React, { useState, useEffect } from 'react';
import { sendData, fetchData } from '../../service/api'; 
//import './ServidorModal.css';

const ServidorModal = ({ isOpen, onClose, servidorData, onSaveSuccess }) => {
    const [formData, setFormData] = useState({
        nome: '',
        matricula: '',
        fk_setor: '', // Usaremos o ID do setor para o banco
        tipo: 'Servidor', 
        situacao: 'ativo', // Valor minúsculo para bater com o CSS/Banco
    });
    
    const [setores, setSetores] = useState([]); // Lista vinda da API Organograma
    const [loading, setLoading] = useState(false);

    // Carrega os setores disponíveis para o Select
    useEffect(() => {
        const carregarSetores = async () => {
            try {
                const data = await fetchData('/api/organograma');
                setSetores(data);
            } catch (error) {
                console.error("Erro ao carregar setores:", error);
            }
        };
        if (isOpen) carregarSetores();
    }, [isOpen]);

    useEffect(() => {
        if (servidorData) {
            setFormData({
                nome: servidorData.nome || '',
                matricula: servidorData.matricula || '',
                fk_setor: servidorData.setor?.id || '', 
                tipo: servidorData.tipo || 'Servidor',
                situacao: servidorData.situacao || 'ativo',
            });
        } else {
            // Reseta o form para novo cadastro
            setFormData({
                nome: '', matricula: '', fk_setor: '', tipo: 'Servidor', situacao: 'ativo'
            });
        }
    }, [servidorData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Montamos o objeto no formato que o JPA espera (vinculando o ID do setor)
        const payload = {
            ...formData,
            setor: { id: formData.fk_setor }
        };

        const method = servidorData ? 'PUT' : 'POST';
        const endpoint = servidorData ? `/api/servidor/${servidorData.id}` : '/api/servidor';

        try {
            await sendData(method, endpoint, payload);
            onSaveSuccess(); // Função para recarregar a tabela
            onClose(); 
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert("Erro ao salvar colaborador.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{servidorData ? 'Editar Colaborador' : 'Novo Colaborador'}</h2>
                    <button className="close-x" onClick={onClose}>&times;</button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nome Completo</label>
                        <input name="nome" value={formData.nome} onChange={handleChange} required />
                    </div>
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label>Matrícula</label>
                            <input name="matricula" value={formData.matricula} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Perfil (Tipo)</label>
                            <select name="tipo" value={formData.tipo} onChange={handleChange}>
                                <option value="Servidor">Servidor</option>
                                <option value="Terceirizado">Terceirizado</option>
                                <option value="Comissionado">Comissionado</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Setor (Lotação)</label>
                            <select name="fk_setor" value={formData.fk_setor} onChange={handleChange} required>
                                <option value="">Selecione um setor...</option>
                                {setores.map(s => (
                                    <option key={s.id} value={s.id}>{s.nomeSetor}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Status</label>
                            <select name="situacao" value={formData.situacao} onChange={handleChange}>
                                <option value="ativo">Ativo</option>
                                <option value="inativo">Inativo</option>
                            </select>
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-cancelar" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="btn-salvar" disabled={loading}>
                            {loading ? 'Processando...' : 'Salvar Dados'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ServidorModal;


*/













/*codigo anterior removido


import React, { useState, useEffect } from 'react';
import { sendData } from '../../service/api'; 
import './ServidorModal.css'; // Vamos criar este CSS em seguida

const ServidorModal = ({ isOpen, onClose, servidorData }) => {
    // Estado inicial do formulário, com campos baseados na sua tela (Nome, Matrícula, Setor, Perfil, Status)
    const [formData, setFormData] = useState({
        nome: '',
        matricula: '',
        setor: '',
        perfil: '',
        status: 'ATIVO', // Valor padrão
        // Adicione outros campos necessários da sua entidade Servidor/Colaborador
    });
    
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (servidorData) {
            // Se for edição, preenche o formulário com os dados existentes
            setFormData({
                nome: servidorData.nome || '',
                matricula: servidorData.matricula || '',
                setor: servidorData.setor || '',
                perfil: servidorData.perfil || '',
                status: servidorData.status || 'ATIVO',
                // Atualize aqui com os outros campos de servidorData
            });
        }
    }, [servidorData]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const method = servidorData ? 'PUT' : 'POST';
        // Se for PUT, a URL precisa do ID
        const endpoint = servidorData 
            ? `servidores/${servidorData.id_servidor}` 
            : 'servidores';

        try {
            await sendData(method, endpoint, formData);
            
            // Sucesso: fecha o modal e recarrega a lista no componente pai
            onClose(); 
        } catch (error) {
            console.error("Erro ao salvar colaborador:", error);
            alert("Erro ao salvar colaborador. Verifique o console.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{servidorData ? 'Editar Colaborador' : 'Novo Colaborador'}</h2>
                <form onSubmit={handleSubmit}>
                    
                    {/* Linha 1: Nome 
                    <div className="form-group">
                        <label htmlFor="nome">Nome</label>
                        <input
                            type="text"
                            id="nome"
                            name="nome"
                            value={formData.nome}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    {/* Linha 2: Matrícula e Perfil 
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="matricula">Matrícula</label>
                            <input
                                type="text"
                                id="matricula"
                                name="matricula"
                                value={formData.matricula}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="perfil">Perfil</label>
                            <input
                                type="text"
                                id="perfil"
                                name="perfil"
                                value={formData.perfil}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Linha 3: Setor e Status 
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="setor">Setor</label>
                            <input
                                type="text"
                                id="setor"
                                name="setor"
                                value={formData.setor}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="status">Status</label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                required
                            >
                                <option value="ATIVO">ATIVO</option>
                                <option value="INATIVO">INATIVO</option>
                                <option value="AFASTADO">AFASTADO</option>
                            </select>
                        </div>
                    </div>
                    
                    {/* Espaço para outros campos (ex: CNH, Categoria, Data de Admissão, etc.) 
                    {/* <div className="form-group"> ... </div> 

                    <div className="modal-actions">
                        <button type="button" className="btn-cancelar" onClick={onClose} disabled={loading}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-salvar" disabled={loading}>
                            {loading ? 'Salvando...' : (servidorData ? 'Atualizar' : 'Cadastrar')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ServidorModal;

*/