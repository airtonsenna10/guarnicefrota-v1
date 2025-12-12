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
                    
                    {/* Linha 2: Matrícula e Perfil */}
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

                    {/* Linha 3: Setor e Status */}
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
                    
                    {/* Espaço para outros campos (ex: CNH, Categoria, Data de Admissão, etc.) */}
                    {/* <div className="form-group"> ... </div> */}

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