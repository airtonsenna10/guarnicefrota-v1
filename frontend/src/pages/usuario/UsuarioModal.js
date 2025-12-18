import React, { useState, useEffect, useMemo } from 'react';
import LoadingOverlay from '../loadingoverlay/LoadingOverlay'; 
import { sendData } from '../../service/api';
import { FaTimes } from 'react-icons/fa';

// --- Funções de Máscara (Fora do componente para performance) ---
const formatCPF = (value) => {
    return value
        .replace(/\D/g, '') // Remove tudo que não é dígito
        .replace(/(\d{3})(\d)/, '$1.$2') // Coloca ponto após os 3 primeiros dígitos
        .replace(/(\d{3})(\d)/, '$1.$2') // Coloca ponto após os 6 primeiros dígitos
        .replace(/(\d{3})(\d{1,2})/, '$1-$2') // Coloca hífen após os 9 primeiros dígitos
        .replace(/(-\d{2})\d+?$/, '$1'); // Impede digitar mais de 11 números
};

const formatPhone = (value) => {
    return value
        .replace(/\D/g, '') 
        .replace(/^(\d{2})(\d)/g, '($1) $2') // Coloca parênteses no DDD
        .replace(/(\d{5})(\d)/, '$1-$2') // Coloca hífen no número
        .replace(/(-\d{4})\d+?$/, '$1'); // Limita o tamanho
};

const UsuarioModal = ({ onClose, onUsuarioSaved, usuarioToEdit, mode }) => {

    console.log("Dados recebidos para edição:", usuarioToEdit);
    
    const isViewMode = mode === 'view';
    const isEditMode = mode === 'edit';
    const isNewMode = mode === 'new';
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [erroSenha, setErroSenha] = useState('');

    const perfisOpcoes = ["ADMIN", "USUARIO"];
    const statusOpcoes = ["ATIVO", "INATIVO"];

    const initialFormData = useMemo(() => ({
        nome: '',
        email: '',
        cpf: '',
        celular: '',
        perfil: 'USUARIO',
        statusConta: 'ATIVO',
        senha: '',
    }), []);

    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        if (usuarioToEdit && (isEditMode || isViewMode)) {
            setFormData({
                ...usuarioToEdit,
                nome: usuarioToEdit.nome || '',
                email: usuarioToEdit.email || '',
                cpf: formatCPF(usuarioToEdit.cpf || ''),  // Aplica a máscara ao carregar dados existentes
                celular: formatPhone(usuarioToEdit.celular || ''),
                perfil: usuarioToEdit.perfil || 'USUARIO',
                statusConta: usuarioToEdit.statusConta || usuarioToEdit.status_conta || 'ATIVO',
                senha: '', 
            });
            setConfirmarSenha('');
        } else if (isNewMode) {
            setFormData(initialFormData);
        }
    }, [usuarioToEdit, mode, isEditMode, isViewMode, isNewMode, initialFormData]);

    // --- handleChange com Máscaras ---
    const handleChange = (e) => {
        if (isViewMode) return; 
        
        const { id, value } = e.target;
        let newValue = value;

        if (id === 'nome') newValue = newValue.toUpperCase();
        if (id === 'cpf') newValue = formatCPF(value);
        if (id === 'celular') newValue = formatPhone(value);

        setFormData(prev => ({ ...prev, [id]: newValue }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isViewMode) return; 

        // Verifica se o ID existe antes de editar
        if (isEditMode && (!usuarioToEdit || !usuarioToEdit.id)) {
            setErroSenha("Erro técnico: ID do usuário não encontrado.");
            return;
        }

        // Validação básica de tamanho
        if (formData.cpf.length < 14) {
            setErroSenha("Por favor, preencha o CPF completo.");
            return;
        }

        if (isNewMode && formData.senha.length < 6) {
            setErroSenha("A senha deve ter no mínimo 6 caracteres.");
            return;
        }

        if (formData.senha !== confirmarSenha && (isNewMode || formData.senha !== '')) {
            setErroSenha("As senhas não coincidem!");
            return;
        }

        setIsSubmitting(true);
        setErroSenha('');

        // Prepara os dados para envio
        // MAPEAMENTO DE DADOS PARA O BACKEND
        const dataToSend = { 
            ...formData,
            cpf: formData.cpf.replace(/\D/g, ''), // salvar apenas números
            celular: formData.celular.replace(/\D/g, ''), // salvar apenas números
            status_conta: formData.statusConta, 
            perfil: formData.perfil
        };
        
        // Remove senha se estiver vazia na edição para não sobrescrever com nada
        if (isEditMode && !formData.senha) delete dataToSend.senha;
        
        const method = isEditMode ? 'PUT' : 'POST';
        const url = isEditMode ? `/api/pessoas/${usuarioToEdit.id}` : '/api/pessoas';

        try {
            await sendData(url, method, dataToSend);
            setIsSubmitting(false);
            onUsuarioSaved(isEditMode ? "Atualizado com sucesso!" : "Cadastrado com sucesso!", 'success');
            onClose();
        } catch (error) {
            setIsSubmitting(false);
            onUsuarioSaved("Erro ao processar. CPF ou E-mail podem já existir.", 'error');
        } 
    };

    const renderViewMode = () => (
        <div className="view-mode-details form-grid">
            <div className="form-group"><label>Nome</label><p>{formData.nome}</p></div>
            <div className="form-group"><label>E-mail</label><p>{formData.email}</p></div>
            <div className="form-group"><label>CPF</label><p>{formData.cpf}</p></div>
            <div className="form-group"><label>Celular</label><p>{formData.celular}</p></div>
            <div className="form-group"><label>Perfil</label><p>{formData.perfil}</p></div>
            <div className="form-group"><label>Status</label><p>{formData.statusConta}</p></div>
        </div>
    );

    return (
        <div className="modal-overlay">
            {isSubmitting && <LoadingOverlay message="Processando..." />}
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{isViewMode ? 'Dados Cadastrais' : isEditMode ? 'Editar Usuário' : 'Novo Usuário'}</h2>
                    <button className="modal-close-btn" onClick={onClose}><FaTimes /></button>
                </div>
                
                {isViewMode ? renderViewMode() : (
                    <form className='form-grid-principal' onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label htmlFor="nome">Nome Completo</label>
                                <input type="text" id="nome" value={formData.nome} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">E-mail</label>
                                <input type="email" id="email" value={formData.email} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="cpf">CPF</label>
                                <input type="text" id="cpf" value={formData.cpf} onChange={handleChange} required placeholder="000.000.000-00" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="celular">Celular</label>
                                <input type="text" id="celular" value={formData.celular} onChange={handleChange} required placeholder="(00) 00000-0000" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="perfil">Perfil</label>
                                <select id="perfil" value={formData.perfil} onChange={handleChange}>
                                    {perfisOpcoes.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="statusConta">Status da Conta</label>
                                <select id="statusConta" value={formData.statusConta} onChange={handleChange}>
                                    {statusOpcoes.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>

                            <div className="form-divider full-width"><h3>Segurança</h3></div>
                            <div className="form-group">
                                <label htmlFor="senha">Senha {isNewMode && '*'}</label>
                                <input type="password" id="senha" value={formData.senha} onChange={handleChange} required={isNewMode} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirmarSenha">Confirmar Senha</label>
                                <input type="password" id="confirmarSenha" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} required={isNewMode || formData.senha !== ''} />
                            </div>

                            {erroSenha && <p className="error-message full-width" style={{color: 'red'}}>{erroSenha}</p>}
                        </div>

                        <div className="modal-actions">
                            <button type="button" onClick={onClose}>Cancelar</button>
                            <button type="submit" className="btn-salvar">
                                {isEditMode ? 'Salvar Edição' : 'Cadastrar Usuário'}
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

export default UsuarioModal;


















/*codigo anterior removido

import React, { useState, useEffect } from 'react';
//import '../style/style-pagina-modal.css'; // Importa o CSS Modal padronizado
//import './UsuarioModal.css'; // Importa o CSS específico do Usuário
import LoadingOverlay from '../loadingoverlay/LoadingOverlay'; 
import { sendData } from '../../service/api';
import { FaTimes } from 'react-icons/fa';

const UsuarioModal = ({ onClose, onUsuarioSaved, usuarioToEdit, mode }) => {
    
    // VARIÁVEIS DE ESTADO E LÓGICA DE MODO
    const isViewMode = mode === 'view';
    const isEditMode = mode === 'edit';
    const isNewMode = mode === 'new';
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [erroSenha, setErroSenha] = useState('');
    
    // Define o título do modal
    const modalTitle = isViewMode ? 'Dados Cadastrais do Usuário' : 
                       isEditMode ? 'Editar Usuário' : 
                       'Novo Cadastro de Usuário';

    // Opções dos dropdowns (Alinhados com o Banco de Dados)
    const perfisOpcoes = ["ADMIN", "USUARIO"];
    const statusOpcoes = ["ATIVO", "INATIVO"];

    // ----------------------------------------------------------------------
    // 1. ESTADO E useEffect (PREENCHIMENTO DE DADOS)
    // ----------------------------------------------------------------------
    const initialFormData = {
        nome: '',
        email: '',
        cpf: '',
        celular: '',
        perfil: 'USUARIO',
        statusConta: 'ATIVO',
        senha: '',
    };

    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        if (usuarioToEdit && (isEditMode || isViewMode)) {
            setFormData({
                ...usuarioToEdit,
                // Garante que o campo perfil e status_conta (snake_case) sejam mapeados corretamente
                nome: usuarioToEdit.nome || '',
                email: usuarioToEdit.email || '',
                cpf: usuarioToEdit.cpf || '',
                celular: usuarioToEdit.celular || '',
                perfil: usuarioToEdit.perfil || 'USUARIO',
                statusConta: usuarioToEdit.statusConta || 'ATIVO',
                senha: '', // Senha sempre inicia vazia na edição
            });
            setConfirmarSenha('');
        } else if (isNewMode) {
            setFormData(initialFormData);
            setConfirmarSenha('');
        }
    }, [usuarioToEdit, mode, isEditMode, isViewMode, isNewMode]);

    // ----------------------------------------------------------------------
    // 2. handleChange (Bloqueado no modo visualização)
    // ----------------------------------------------------------------------
    const handleChange = (e) => {
        if (isViewMode) return; 
        
        const { id, value } = e.target;
        let newValue = value;

        // Capitalização para o nome
        if (id === 'nome') {
            newValue = newValue.toUpperCase();
        }

        setFormData(prev => ({ ...prev, [id]: newValue }));
    };

    // ----------------------------------------------------------------------
    // 3. handleSubmit (POST vs PUT)
    // ----------------------------------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isViewMode) return; 

        // Validação de Senha
        if (isNewMode && formData.senha.length < 6) {
            setErroSenha("A senha deve ter no mínimo 6 caracteres.");
            return;
        }

        if (formData.senha !== confirmarSenha && (isNewMode || formData.senha !== '')) {
            setErroSenha("As senhas não coincidem!");
            return;
        }

        setIsSubmitting(true);
        setErroSenha('');

        const dataToSend = {
            ...formData,
            // Remove a senha se estiver vazia (em modo edição)
            ...(isEditMode && !formData.senha && { senha: undefined })
        };
        
        const method = isEditMode ? 'PUT' : 'POST';
        const url = isEditMode ? `/api/pessoas/${usuarioToEdit.id}` : '/api/pessoas';
        const successMsg = isEditMode ? "Usuário atualizado com sucesso!" : "Usuário cadastrado com sucesso!";

        try {
            await sendData(url, method, dataToSend);
            setIsSubmitting(false);
            onUsuarioSaved(successMsg, 'success');
            onClose();
        } catch (error) {
            console.error("Erro ao salvar usuário:", error);
            setIsSubmitting(false);
            onUsuarioSaved("Erro ao salvar usuário. Verifique se o E-mail ou CPF já existem.", 'error');
        } 
    };

    // ----------------------------------------------------------------------
    // 4. Renderização do Modo Visualização
    // ----------------------------------------------------------------------
    const renderViewMode = () => (
        <div className="view-mode-details form-grid">
            <div className="form-group">
                <label>Nome Completo</label>
                <p>{formData.nome || 'Não informado'}</p>
            </div>
            <div className="form-group">
                <label>E-mail</label>
                <p>{formData.email || 'Não informado'}</p>
            </div>
            <div className="form-group">
                <label>CPF</label>
                <p>{formData.cpf || 'Não informado'}</p>
            </div>
            <div className="form-group">
                <label>Celular</label>
                <p>{formData.celular || 'Não informado'}</p>
            </div>
            <div className="form-group">
                <label>Perfil de Acesso</label>
                <p>{formData.perfil}</p>
            </div>
            <div className="form-group">
                <label>Status da Conta</label>
                <p>{formData.statusConta}</p>
            </div>
        </div>
    );

    // ----------------------------------------------------------------------
    // 5. Renderização Final
    // ----------------------------------------------------------------------
    return (
        <div className="modal-overlay">
            {isSubmitting && <LoadingOverlay message={isEditMode ? "Atualizando..." : "Salvando..."} />}

            <div className="modal-content">
                <div className="modal-header">
                    <h2>{modalTitle}</h2>
                    <button className="modal-close-btn" onClick={onClose} title="Fechar"><FaTimes /></button>
                </div>
                
                {isViewMode ? renderViewMode() : (
                    <form className='form-grid-principal' onSubmit={handleSubmit}>
                        <div className="form-grid">
                            
                            <div className="form-group full-width">
                                <label htmlFor="nome">Nome Completo</label>
                                <input type="text" id="nome" value={formData.nome} onChange={handleChange} required />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">E-mail</label>
                                <input type="email" id="email" value={formData.email} onChange={handleChange} required />
                            </div>

                            <div className="form-group">
                                <label htmlFor="cpf">CPF</label>
                                <input type="text" id="cpf" value={formData.cpf} onChange={handleChange} required maxLength="14" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="celular">Celular</label>
                                <input type="text" id="celular" value={formData.celular} onChange={handleChange} required />
                            </div>

                            <div className="form-group">
                                <label htmlFor="papel">Perfil</label>
                                <select id="papel" value={formData.perfil} onChange={handleChange}>
                                    {perfisOpcoes.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="status_conta">Status da Conta</label>
                                <select id="status_conta" value={formData.statusConta} onChange={handleChange}>
                                    {statusOpcoes.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>

                            <div className="form-divider full-width">
                                <h3>{isEditMode ? 'Alterar Senha (Opcional)' : 'Segurança'}</h3>
                            </div>

                            <div className="form-group">
                                <label htmlFor="senha">Senha {isNewMode && '*'}</label>
                                <input 
                                    type="password" 
                                    id="senha" 
                                    value={formData.senha} 
                                    onChange={handleChange} 
                                    required={isNewMode}
                                    placeholder={isEditMode ? "Deixe em branco para manter" : "Mín. 6 caracteres"}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmarSenha">Confirmar Senha</label>
                                <input 
                                    type="password" 
                                    id="confirmarSenha" 
                                    value={confirmarSenha} 
                                    onChange={(e) => setConfirmarSenha(e.target.value)} 
                                    required={isNewMode || formData.senha !== ''}
                                />
                            </div>

                            {erroSenha && <p className="error-message full-width">{erroSenha}</p>}

                        </div>

                        <div className="modal-actions">
                            <button type="button" className="btn-cancelar" onClick={onClose} disabled={isSubmitting}>Cancelar</button>
                            <button type="submit" className="btn-salvar" disabled={isSubmitting}>
                                {isEditMode ? 'Salvar Edição' : 'Cadastrar Usuário'}
                            </button>
                        </div>
                    </form>
                )}
                
                {isViewMode && (
                    <div className="modal-actions">
                        <button type="button" className="btn-fechar" onClick={onClose}>Fechar</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UsuarioModal;

*/





/*      

import React, { useState, useEffect } from 'react';
import { sendData } from '../../service/api'; 
import './UsuarioModal.css'; 

// Ajustado para bater com o ENUM do seu Banco de Dados
const PERFIS = ['ADMIN', 'USUARIO'];
const STATUS = ['ATIVO', 'INATIVO'];

const UsuarioModal = ({ isOpen, onClose, usuarioData, onSaveSuccess }) => {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        cpf: '',
        celular: '',
        papel: PERFIS[2], // Inicia como OPERADOR por padrão
        status_conta: STATUS[0], // Inicia como ATIVO
        senha: '',
    });
    
    const [loading, setLoading] = useState(false);
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [erroSenha, setErroSenha] = useState('');

    useEffect(() => {
        if (usuarioData) {
            setFormData({
                nome: usuarioData.nome || '',
                email: usuarioData.email || '',
                cpf: usuarioData.cpf || '',
                celular: usuarioData.celular || '',
                // Mapeamos para 'papel' e 'status_conta' conforme o JSON da API
                papel: usuarioData.papel || PERFIS[2],
                status_conta: usuarioData.status_conta || usuarioData.statusConta || STATUS[0],
                senha: '', 
            });
            setConfirmarSenha('');
        } else {
            // Resetar formulário ao abrir para "Novo"
            setFormData({
                nome: '', email: '', cpf: '', celular: '',
                papel: 'OPERADOR', status_conta: 'ATIVO', senha: ''
            });
            setConfirmarSenha('');
        }
    }, [usuarioData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErroSenha('');

        const isEditing = !!usuarioData;

        // Validação básica de senha
        if (!isEditing && formData.senha.length < 6) {
             setErroSenha('A senha deve ter no mínimo 6 caracteres.');
             setLoading(false);
             return;
        }

        if (formData.senha !== confirmarSenha) {
            setErroSenha('As senhas não coincidem!');
            setLoading(false);
            return;
        }

        let dataToSend = { ...formData };
        if (isEditing && formData.senha === '') {
            delete dataToSend.senha;
        }
        
        // Endpoint e método HTTP
        const method = isEditing ? 'PUT' : 'POST';
        const endpoint = isEditing 
            ? `api/pessoas/${usuarioData.id}` 
            : 'api/pessoas';                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        

        try {
            await sendData(method, endpoint, dataToSend);
            alert(isEditing ? "Usuário atualizado!" : "Usuário cadastrado com sucesso!");
            onSaveSuccess(); // Função para atualizar a lista no pai
            onClose(); 
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert("Erro ao salvar. Verifique se o e-mail ou CPF já estão cadastrados.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{usuarioData ? 'Editar Usuário' : 'Novo Usuário'}</h2>
                <form onSubmit={handleSubmit}>
                    
                    <div className="form-group">
                        <label>Nome Completo</label>
                        <input type="text" name="nome" value={formData.nome} onChange={handleChange} required />
                    </div>
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label>E-mail</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>CPF</label>
                            <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} required maxLength="14" />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Celular</label>
                            <input type="text" name="celular" value={formData.celular} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Perfil de Acesso</label>
                            <select name="papel" value={formData.papel} onChange={handleChange}>
                                {PERFIS.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label>Status da Conta</label>
                        <select name="status_conta" value={formData.status_conta} onChange={handleChange}>
                            {STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    <hr />
                    <h3>{usuarioData ? 'Alterar Senha (Opcional)' : 'Senha de Acesso'}</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Senha</label>
                            <input type="password" name="senha" value={formData.senha} onChange={handleChange} required={!usuarioData} />
                        </div>
                        <div className="form-group">
                            <label>Confirmar Senha</label>
                            <input type="password" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} required={!usuarioData || formData.senha !== ''} />
                        </div>
                    </div>
                    
                    {erroSenha && <p className="error-message" style={{color: 'red'}}>{erroSenha}</p>}

                    <div className="modal-actions">
                        <button type="button" className="btn-cancelar" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="btn-salvar" disabled={loading}>
                            {loading ? 'Processando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UsuarioModal;

*/




/* codigo anterior removido 

import React, { useState, useEffect } from 'react';
import { sendData } from '../../service/api'; 
import './UsuarioModal.css'; 

// Opções de Perfil e Status, baseadas nas colunas ENUM do seu BD.
const PERFIS = ['ADMIN', 'USUARIO'];
const STATUS = ['ATIVO', 'INATIVO'];

const UsuarioModal = ({ isOpen, onClose, usuarioData }) => {
    // Estado inicial do formulário
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        cpf: '',
        celular: '',
        perfil: PERFIS[0], // Padrão
        statusConta: STATUS[0], // Padrão
        senha: '', // Senha sempre deve ser tratada com cuidado
    });
    
    const [loading, setLoading] = useState(false);
    const [confirmarSenha, setConfirmarSenha] = useState('');  // Estado para confirmar a senha no cadastro
    const [erroSenha, setErroSenha] = useState('');

    useEffect(() => {
        if (usuarioData) {
            // Se for edição, preenche o formulário. Senha fica vazia, pois não deve ser exibida/enviada a menos que seja alterada.
            setFormData({
                nome: usuarioData.nome || '',
                email: usuarioData.email || '',
                cpf: usuarioData.cpf || '',
                celular: usuarioData.celular || '',
                perfil: usuarioData.perfil || PERFIS[0],
                statusConta: usuarioData.statusConta || STATUS[0],
                senha: '', // Deixa a senha vazia ao editar
            });
        }
    }, [usuarioData]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErroSenha(''); // Limpa erros anteriores

        const isEditing = !!usuarioData;

        // 1. Validação de Senha (Obrigatória no Cadastro, opcional na Edição)
        if (!isEditing && formData.senha.length < 6) {
             setErroSenha('A senha deve ter no mínimo 6 caracteres.');
             setLoading(false);
             return;
        }

        if (formData.senha !== confirmarSenha) {
            setErroSenha('As senhas não coincidem!');
            setLoading(false);
            return;
        }

        // 2. Preparação dos Dados
        let dataToSend = { ...formData };
        
        // Se estiver editando e a senha estiver vazia, removemos ela do objeto de envio
        // para que o backend não sobrescreva a senha hash existente por um valor nulo/vazio.
        if (isEditing && formData.senha === '') {
            delete dataToSend.senha;
        }
        
        // 3. Envio dos Dados                                                                                                                                                                                                                             
        const method = isEditing ? 'PUT' : 'POST';
        const endpoint = isEditing                                                                                                                                                                                                                                                                                                                      
            ? `usuarios/${usuarioData.id}` 
            : 'usuarios';                                                                                                                                                                               

        try {
            await sendData(method, endpoint, dataToSend);
            
            // Sucesso: fecha o modal e recarrega a lista
            onClose(); 
        } catch (error) {
            console.error("Erro ao salvar usuário:", error);
            // Mensagem de erro mais amigável, como "E-mail já cadastrado"
            alert("Erro ao salvar usuário. Verifique o console ou se o E-mail já está em uso.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{usuarioData ? 'Editar Usuário' : 'Novo Usuário'}</h2>
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
                    
                    {/* Linha 2: E-mail e CPF 
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="email">E-mail</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="cpf">CPF</label>
                            <input
                                type="text"
                                id="cpf"
                                name="cpf"
                                value={formData.cpf}
                                onChange={handleChange}
                                required
                                maxLength="14" // Para incluir formatação se desejar
                            />
                        </div>
                    </div>

                    {/* Linha 3: Celular e Perfil 
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="celular">Celular</label>
                            <input
                                type="text"
                                id="celular"
                                name="celular"
                                value={formData.celular}
                                onChange={handleChange}
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="papel">Perfil (Papel)</label>
                            <select
                                id="papel"
                                name="papel"
                                value={formData.papel}
                                onChange={handleChange}
                                required
                            >
                                {PERFIS.map(perfil => (
                                    <option key={perfil} value={perfil}>{perfil}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    {/* Linha 4: Status da Conta *
                    <div className="form-row">
                         <div className="form-group">
                            <label htmlFor="status_conta">Status da Conta</label>
                            <select
                                id="status_conta"
                                name="status_conta"
                                value={formData.status_conta}
                                onChange={handleChange}
                                required
                            >
                                {STATUS.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            {/* Espaço Vazio para alinhar 
                        </div>
                    </div>


                    {/* Linha 5: Senha 
                    <h3>{usuarioData ? 'Alterar Senha (Opcional)' : 'Senha de Acesso'}</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="senha">Nova Senha {usuarioData ? '' : '(Obrigatório)'}</label>
                            <input
                                type="password"
                                id="senha"
                                name="senha"
                                value={formData.senha}
                                onChange={handleChange}
                                placeholder={usuarioData ? 'Deixe vazio para manter a atual' : 'Mín. 6 caracteres'}
                                required={!usuarioData}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmarSenha">Confirmar Senha</label>
                            <input
                                type="password"
                                id="confirmarSenha"
                                name="confirmarSenha"
                                value={confirmarSenha}
                                onChange={(e) => setConfirmarSenha(e.target.value)}
                                required={!usuarioData || formData.senha !== ''}
                            />
                        </div>
                    </div>
                    
                    {erroSenha && <p className="error-message">{erroSenha}</p>}


                    <div className="modal-actions">
                        <button type="button" className="btn-cancelar" onClick={onClose} disabled={loading}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-salvar" disabled={loading}>
                            {loading ? 'Salvando...' : (usuarioData ? 'Atualizar Usuário' : 'Cadastrar Usuário')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UsuarioModal;

*/