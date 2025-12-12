import React, { useState, useEffect } from 'react';
import { sendData } from '../../service/api'; 
import './UsuarioModal.css'; 

// Opções de Papel (Perfil) e Status, baseadas nas colunas ENUM do seu BD.
const PERFIS = ['ADMIN', 'GESTOR', 'OPERADOR'];
const STATUS = ['ATIVO', 'INATIVO'];

const UsuarioModal = ({ isOpen, onClose, usuarioData }) => {
    // Estado inicial do formulário
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        cpf: '',
        celular: '',
        papel: PERFIS[0], // Padrão
        status_conta: STATUS[0], // Padrão
        senha: '', // Senha sempre deve ser tratada com cuidado
    });
    
    const [loading, setLoading] = useState(false);
    // Estado para confirmar a senha no cadastro
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [erroSenha, setErroSenha] = useState('');

    useEffect(() => {
        if (usuarioData) {
            // Se for edição, preenche o formulário. Senha fica vazia, pois não deve ser exibida/enviada a menos que seja alterada.
            setFormData({
                nome: usuarioData.nome || '',
                email: usuarioData.email || '',
                cpf: usuarioData.cpf || '',
                celular: usuarioData.celular || '',
                papel: usuarioData.papel || PERFIS[0],
                status_conta: usuarioData.status_conta || STATUS[0],
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
        // Se estiver cadastrando (POST), a senha é obrigatória (validada acima).

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
                    
                    {/* Linha 1: Nome */}
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
                    
                    {/* Linha 2: E-mail e CPF */}
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

                    {/* Linha 3: Celular e Perfil */}
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
                    
                    {/* Linha 4: Status da Conta */}
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
                            {/* Espaço Vazio para alinhar */}
                        </div>
                    </div>


                    {/* Linha 5: Senha */}
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