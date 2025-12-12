import React, { useState, useEffect } from 'react';
import { sendData } from '../../service/api'; 
import './MotoristaModal.css'; 

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