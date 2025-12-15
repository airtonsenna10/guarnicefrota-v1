
import React, { useState, useEffect } from 'react';
import './ManutencaoModal.css';
import LoadingOverlay from '../loadingoverlay/LoadingOverlay'; 
import { sendData } from '../../service/api';
import { FaTimes } from 'react-icons/fa';

// Recebe as novas props: veiculoToEdit (dados) e mode ('new', 'view', 'edit')
const ManutencaoModal = ({ onClose, onManutencaoSaved, manutencaoToEdit, mode }) => {

     const API_ENDPOINT = '/api/manutencoes';
    
    // 🔑 NOVAS VARIÁVEIS DE ESTADO E LÓGICA
    const isViewMode = mode === 'view';
    const isEditMode = mode === 'edit';
    const isNewMode = mode === 'new';
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Define o título do modal
    const modalTitle = isViewMode ? 'Dados Cadastrais da manutenção' : 
                       isEditMode ? 'Editar Manutenção' : 
                       'Novo Cadastro de Manutenção';


    // ----------------------------------------------------------------------
    // 1. ESTADO E useEffect (PREENCHIMENTO DE DADOS)
    // ----------------------------------------------------------------------

    const initialFormData = {
        veiculo: '', tipoManutencao: '', descricao: '', dataInicio: '', 
        previsaoEntrega: '', horarioMarcado:'' , status: 'Não Iniciado',
    };
    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        // Preenche o formulário se estiver em modo Edição ou Visualização
        if (manutencaoToEdit && (isEditMode || isViewMode)) {
            // NOTE: Ajuste a normalização do status, propriedade, e categoria para exibir no dropdown
            // Ex: EM_MANUTENCAO deve voltar a ser "Em Manutenção"
            
            // Função auxiliar para reverter o ENUM para o texto legível (reverte o normalizeEnum do handleSubmit)
            const reverseNormalizeEnum = (value) => {
                if (!value) return '';
                // Ex: "EM_MANUTENCAO" -> "EM MANUTENCAO" -> "Em Manutencao"
                return value.replace(/_/g, ' ').toLowerCase().replace(/(^|\s)\S/g, l => l.toUpperCase());
            };
            
            setFormData({
                ...manutencaoToEdit,
                // Mapeamento especial para ENUMs que foram formatados
                status: reverseNormalizeEnum(manutencaoToEdit.status),
                
            });
        } else if (isNewMode) {
            // Zera o formulário para novo cadastro
            setFormData(initialFormData);
        }
    }, [manutencaoToEdit, mode, isEditMode, isViewMode, isNewMode]);


    // ----------------------------------------------------------------------
    // 2. handleChange (Desabilitar no modo Visualização)
    //Esta função é disparada toda vez que o valor de um campo de formulário (como um <input> ou <select>) muda.
    // ----------------------------------------------------------------------
    const handleChange = (e) => {
        if (isViewMode) return;
        
        const { id, value } = e.target;
        let newValue = value;

        // 1. Campos que são IDs de Referência (Ex: Placa do Veículo)
        // Se você estiver usando um campo de input para a PLACA do veículo de referência:
        const identificationFields = ['placa']; 

        // 2. Campos de Texto que devem ser padronizados (Maiúsculas, mas legíveis)
        const descriptionFields = ['tipoManutencao', 'descricao']; 

        if (identificationFields.includes(id)) {
            // Formatação Pesada: Maiúsculas, sem acentos, sem espaços internos
            newValue = newValue
                .toUpperCase() // Converte para maiúsculas
                .trim() // Remove espaços no início/fim
                .normalize("NFD") // Normaliza para decompor caracteres acentuados
                .replace(/[\u0300-\u036f]/g, "") // Remove todos os caracteres diacríticos (acentos)
                .replace(/\s/g, ''); // Remove todos os espaços internos (no meio, no início e no fim)
                
        } else if (descriptionFields.includes(id)) {
            // Formatação Leve: Maiúsculas, com espaços internos e acentos permitidos
            newValue = newValue.toUpperCase().trim();
        }
        
        // Datas, Horários, e Selects (Status) NÃO são formatados aqui.

        setFormData(prev => ({ ...prev, [id]: newValue }));
    };
    // ----------------------------------------------------------------------
    // 3. handleSubmit (POST vs PUT)
    //Esta função assíncrona é chamada quando o usuário clica no botão "Salvar" ou "Salvar Edição" e o evento de submissão do formulário é acionado.
    // ----------------------------------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita o comportamento padrão do formulário HTML de recarregar a página, permitindo que o React gerencie o envio de dados via AJAX (sendData).
        
        // Não faz nada se o Modal for para Visualização
        if (isViewMode) return; 
        
        setIsSubmitting(true); // Indica que o formulário está sendo submetido

        // Normaliza os ENUMs para o formato esperado pela API
        const normalizeEnum = (value) => {
            if (!value) return '';
            return value.toUpperCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/\s/g, '_'); 
        };

        // Prepara os dados para envio (Contrução do objeto dataToSend)
        const dataToSend = {
            // Em modo Edição (PUT), precisamos do ID no corpo da requisição
            ...(isEditMode && manutencaoToEdit.id && {id: manutencaoToEdit.id}),
            ...formData,
        
            status: normalizeEnum(formData.status), 
            // Exemplo de mapeamento para snake_case se a API exigir:
            placa: formData.placa, // Placa do veículo associado
            tipoManutencao: formData.tipoManutencao,
            dataInicio: formData.dataInicio,
            previsaoEntrega: formData.previsaoEntrega, // Corrigido para match com a propriedade Java 'previsaoEntrega'
            horarioMarcado: formData.horarioMarcado,
            // etc.
            
        };
        
        // Define o método e a URL
        const method = isEditMode ? 'PUT' : 'POST';
        const url = isEditMode ? `/api/manutencoes/${manutencaoToEdit.id}` : '/api/manutencoes';
        
        const successMsg = isEditMode ? "Manutenção atualizada com sucesso!" : "Manutenção cadastrada com sucesso!";

        try {
            await sendData(url, method, dataToSend);
            
            setIsSubmitting(false);
            onManutencaoSaved(successMsg, 'success');
            onClose();

        } catch (error) {
            console.error(`Erro ao ${isEditMode ? 'atualizar' : 'cadastrar'} manutenção:`, error);
            setIsSubmitting(false);
            
            const errorMsg = `Erro ao ${isEditMode ? 'atualizar' : 'cadastrar'} manutenção. Verifique os dados.`;
            onManutencaoSaved(errorMsg, 'error');
        } 
    };

    // ----------------------------------------------------------------------
    // 4. Renderização do Modo Visualização
    // Esta função retorna o JSX que exibe os detalhes da manutenção em formato de visualização somente leitura.
    // ----------------------------------------------------------------------

    const renderViewMode = () => (
        <div className="view-mode-details form-grid">
            <div className="form-group">
                <label>Modelo</label>
                <p>{formData.modelo}</p>
            </div>
            <div className="form-group">
                <label>Placa</label>
                <p>{formData.placa}</p>
            </div>
            <div className="form-group">
                <label>Tipo de Manutenção</label>
                <p>{formData.tipoManutencao}</p>
            </div>
            <div className="form-group">
                <label>Descrição</label>
                <p>{formData.descricao}</p>
            </div>
             <div className="form-group">
                <label>Data de Inicio</label>
                <p>{formData.dataInicio}</p>
            </div>
            <div className="form-group">
                <label>Previsão de Entrega</label>
                <p>{formData.previsaoEntrega}</p>
            </div>
             <div className="form-group">
                <label>Horário Marcado</label>
                <p>{formData.horarioMarcado}</p>
            </div>
            <div className="form-group">
                <label>Status</label>
                <p>{formData.status}</p>
            </div>
        </div>
    );

    // Opções dos dropdowns (Exemplo)
    const statusOpcoes = ["Concluída", "Não Iniciado", "Cancelada", "Em Andamento"];
    

    
    // ----------------------------------------------------------------------
    // 5. Renderização Final do Modal
    //  Esta parte monta o modal completo, incluindo o título, o botão de fechar, o corpo (que pode ser o modo visualização ou o formulário) e os botões de ação.
    // ----------------------------------------------------------------------
    
    return (
        <div className="modal-overlay">
            {isSubmitting && <LoadingOverlay message={isEditMode ? "Atualizando..." : "Salvando..."} />}

            <div className="modal-content">
                <h2>{modalTitle}</h2>
                {/*<button className="modal-close-btn" onClick={onClose}>&times;</button>*/}
                <button className="modal-close-btn" onClick={onClose} title="Fechar" ><FaTimes /> </button>
                
                {/*Renderiza o Modo Visualização OU o Formulário */}
                {isViewMode ? renderViewMode() : (
                    <form className='form-grid-principal' onSubmit={handleSubmit}>
                        <div className="form-grid">
                            
                            <div className="form-group">
                                <label htmlFor="placa">Placa</label>
                                <input type="text" id="placa" value={formData.placa} onChange={handleChange} required maxLength="8" disabled={isViewMode} /> 
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="tipoManutencao">Tipo de Manutenção</label>
                                <input type="text" id="tipoManutencao" value={formData.tipoManutencao}  onChange={handleChange} required maxLength="50" /* Opcional: limite o tamanho */ disabled={isViewMode} 
    />
                            </div>
                            
                            {/* Descrição completa (usa o 'full-width' CSS para ocupar 2 colunas) */}
                            <div className="form-group full-width">
                                <label htmlFor="descricao">Descrição do Serviço</label>
                                <textarea id="descricao" value={formData.descricao} onChange={handleChange} required disabled={isViewMode} rows="3" />
                            </div>
                
                            <div className="form-group">
                                <label htmlFor="dataInicio">Data de Início</label>
                                 <input type="date" id="dataInicio" value={formData.dataInicio} onChange={handleChange} required disabled={isViewMode} />
                            </div>
                                
                            <div className="form-group">
                                <label htmlFor="previsaoEntrega">Previsão de Entrega</label>
                                <input type="date" id="previsaoEntrega" value={formData.previsaoEntrega} onChange={handleChange} disabled={isViewMode} />
                            </div>

                            <div className="form-group">
                                <label htmlFor="horarioMarcado">Horário Marcado</label>
                                <input type="time" id="horarioMarcado" value={formData.horarioMarcado} onChange={handleChange} disabled={isViewMode} />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="status">Status</label>
                                <select id="status" value={formData.status} onChange={handleChange} disabled={isViewMode}>
                                    {statusOpcoes.map(s => (<option key={s} value={s}>{s}</option>))}
                                </select>
                            </div>
                            

                        </div>
                        <div className="modal-actions">
                            <button type="button" onClick={onClose} disabled={isSubmitting}>Cancelar</button>
                            {/* Oculta o botão Salvar/Atualizar se for Visualização */}
                            {(!isViewMode) && (
                                <button type="submit" disabled={isSubmitting}>
                                    {isEditMode ? 'Salvar Edição' : 'Salvar'}
                                </button>
                            )}
                        </div>
                    </form>
                )}
                
                {/* Botão Fechar/Cancelar no modo Visualização */}
                {isViewMode && (<div className="modal-actions"> <button type="button" onClick={onClose}>Fechar</button></div>)}
            </div>
        </div>
    );
};

export default ManutencaoModal;















/*==============================================================================

import React, { useState, useEffect } from 'react';
import { FaSearch, FaEye, FaEdit, FaTrashAlt } from 'react-icons/fa';
import { fetchData, sendData } from '../../service/api'; 
import NotificationToast from '../loadingoverlay/NotificationToast'; 

import './Manutencoes.css'; 

const Manutencoes = () => {
    
    // ENDPOINT REAL (Baseado na tabela tb08_manutencao)
    const API_ENDPOINT = '/api/manutencoes'; 
    
    // 1. INICIALIZAÇÃO CORRETA PARA USO DA API
    const [manutencoes, setManutencoes] = useState([]); // Inicia vazio, sem mockData
    const [loading, setLoading] = useState(true); // Começa true para buscar dados
    const [error, setError] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [manutencaoSelecionada, setManutencaoSelecionada] = useState(null); 
    const [notification, setNotification] = useState(null); 
    
    // ----------------------------------------------------------------------
    // FUNÇÃO DE CARREGAMENTO REAL DA API
    // ----------------------------------------------------------------------
    const getManutencoes = async () => {
        try {
            setLoading(true);
            const data = await fetchData(API_ENDPOINT);
            setManutencoes(data);
            setError(null); 
        } catch (err) {
            console.error("Erro ao buscar manutenções:", err);
            setError("Erro ao carregar dados de manutenção. Verifique o servidor.");
        } finally {
            setLoading(false);
        }
    };

    // CHAMA O FETCH NA MONTAGEM DO COMPONENTE
    // Foi removida a duplicação do useEffect.
    useEffect(() => {
        getManutencoes();
    }, []);
    
    // FUNÇÕES DE CALLBACK APÓS SALVAR/EXCLUIR
    const handleManutencaoSaved = (message, type) => {
        setNotification({ message, type });
        if (type === 'success') { getManutencoes(); } // Recarrega a lista
    };
    
    const dismissNotification = () => setNotification(null);

    // FUNÇÕES PARA MODAL
    const handleOpenModal = () => {
        setManutencaoSelecionada(null); 
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setManutencaoSelecionada(null);
    };

    // ----------------------------------------------------------------------
    // FUNÇÕES DE AÇÃO NA TABELA
    // ----------------------------------------------------------------------

    const handleVisualizar = (manutencao) => {
        setManutencaoSelecionada(manutencao); 
        setIsModalOpen(true);
    };

    const handleEditar = (manutencao) => {
        setManutencaoSelecionada(manutencao); 
        setIsModalOpen(true);
    };

    const handleExcluir = async (manutencao) => {
        // Usa a PK do banco: id_manutencao
        const idToDelete = manutencao.id_manutencao; 
        const veiculoDisplay = `${manutencao.placa || 'N/A'} - ${manutencao.modelo || 'N/A'}`; // Supondo que a API inclua placa/modelo

        if (!idToDelete) {
            handleManutencaoSaved("Erro: ID da Manutenção não encontrado.", 'error');
            return;
        }

        if (window.confirm(`Tem certeza que deseja excluir a Manutenção ID: ${idToDelete} do veículo ${veiculoDisplay}?`)) {
            try {
                await sendData(`${API_ENDPOINT}/${idToDelete}`, 'DELETE'); 
                handleManutencaoSaved("Manutenção excluída com sucesso!", 'success');
            } catch (error) {
                console.error("Erro ao excluir:", error);
                handleManutencaoSaved("Erro ao excluir. Tente novamente.", 'error');
            }
        }
    };

    // Função para renderizar a etiqueta de status (adaptada para status_manutencao do DB)
    const renderStatus = (status) => {
        if (!status) return null;
        
        const normalizado = status
            .toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
            .replace(/[\s_]/g, "-"); 

        let statusClass = '';
        switch (normalizado) {
            case 'nao-iniciado': statusClass = 'status-aguardando'; break; 
            case 'em-andamento': statusClass = 'status-em-uso'; break; 
            case 'concluida': statusClass = 'status-disponivel'; break; 
            case 'cancelada': statusClass = 'status-inativo'; break; 
            default: statusClass = 'status-desconhecido';
        }
        return <span className={`status-pill ${statusClass}`}>{status}</span>;
    };
    
    if (loading) {
        return <div className="manutencoes-container">Carregando manutenções...</div>;
    }

    if (error) {
        return <div className="manutencoes-container">Erro: {error}</div>;
    }

    return (
        <div className="manutencoes-container">
            {/* Cabeçalho com Título e Botão *
            <div className="header-container">
                <h1 className="page-title">Cadastro de Manutenção</h1>
                <button className="btn-nova-manutencao" onClick={handleOpenModal}>Novo Cadastro</button>
            </div>

            {/* Área de Pesquisa - Mantida *
            <div className="area-pesquisa-container">
                <h3 className="area-pesquisa-titulo">
                    <FaSearch /> Área de Pesquisa
                </h3>
                 <div className="filtros-container">
                    <div className="filtro-item">
                        <label htmlFor="placa-veiculo">Placa do Veículo</label>
                        <input type="text" id="placa-veiculo" className="filtro-input" />
                    </div>
                    <div className="filtro-item">
                        <label htmlFor="data-solicitacao">Data</label>
                        <input type="date" id="data-solicitacao" className="filtro-input" />
                    </div>
                    <div className="filtro-item">
                        <label htmlFor="status-select">Status</label>
                        <select id="status-select" className="filtro-select">
                            <option>Todos</option>
                            <option>Não iniciado</option>
                            <option>Em andamento</option>
                            <option>Concluida</option>
                            <option>Cancelada</option>
                        </select>
                    </div>
                 </div>
            </div>


            {/* Tabela de Manutenções 
            <div className="tabela-wrapper">
                <table className="tabela-manutencao">
                    <thead>
                        <tr>
                            <th>Veiculo</th>
                            <th>Tipo de manutenção</th>
                            <th>Descrição</th>
                            <th>Data de Início</th>
                            <th>Data Final</th> 
                            <th>Status</th>
                            <th>Ações</th> 
                        </tr>
                    </thead>
                    <tbody>
                        {manutencoes.length > 0 ? (
                            manutencoes.map((manutencao) => (
                                // ⚠️ Chave única: id_manutencao
                                <tr key={manutencao.id_manutencao}>
                                    {/* ⚠️ CAMPOS: Usando campos reais do DB tb08_manutencao e dados de veículo agregados 
                                    <td>{`${manutencao.placa || manutencao.fk_veiculo} - ${manutencao.modelo || 'N/A'}`}</td>
                                    <td>{manutencao.tipo_manutencao}</td>
                                    <td>{manutencao.descricao}</td>
                                    <td>{manutencao.data_inicio}</td>
                                    <td>{manutencao.data_fim || '-'}</td> 
                                    <td>{renderStatus(manutencao.status_manutencao)}</td> 
                                    
                                    <td className="acoes-cell">
                                        <button 
                                            className="action-button view-button" 
                                            title="Visualizar" 
                                            onClick={() => handleVisualizar(manutencao)}
                                        >
                                            <FaEye />
                                        </button>
                                        <button 
                                            className="action-button edit-button" 
                                            title="Editar" 
                                            onClick={() => handleEditar(manutencao)}
                                        >
                                            <FaEdit />
                                        </button>
                                        <button 
                                            className="action-button delete-button" 
                                            title="Excluir" 
                                            onClick={() => handleExcluir(manutencao)}
                                        >
                                            <FaTrashAlt />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center' }}>Nenhuma manutenção cadastrada.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            
            {/* RENDERIZAÇÃO DO MODAL
            {isModalOpen && (
                <ManutencaoModal
                    onClose={handleCloseModal}
                    onItemSaved={handleManutencaoSaved}
                    itemToEdit={manutencaoSelecionada} 
                />
            )}
            

            {/* RENDERIZAÇÃO DO TOAST *
            {notification && (
                <NotificationToast
                    message={notification.message}
                    type={notification.type}
                    onDismiss={dismissNotification}
                    duration={3000} 
                />
            )}
        </div>
    );
};

export default ManutencaoModal;

*/