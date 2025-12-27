
import React, { useState, useEffect } from 'react';
import { FaSearch, FaEye, FaPlus ,FaEdit, FaTrashAlt } from 'react-icons/fa'; // Incluído FaEye e FaTrashAlt
import { fetchData, sendData } from '../../service/api'; 
// import AlertaModal from './AlertaModal'; // Descomente após ter o arquivo
import NotificationToast from '../loadingoverlay/NotificationToast'; // Descomente após ter o arquivo

// import './Alerta.css'; // REMOVIDO: Será substituído pelo padrão
//import '../style/style-pagina-principal.css'; // NOVO: Importa o CSS padrão de página principal

const Alerta = () => {
    // Endereço da API para alertas
    const API_ENDPOINT = '/api/alertas'; 

    const [alertas, setAlertas] = useState([]); // Lista de alertas
    const [veiculos, setVeiculos] = useState([]); // Lista de veículos para o dropdown do modal
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // ESTADO PADRONIZADO DO MODAL 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState({ 
        alerta: null, 
        mode: 'new' // 'new', 'view', 'edit'
    });
    const [notification, setNotification] = useState(null); // Estado para a notificação
    
    // Estado para Filtros (mantido do original)
    const [filtroPlaca, setFiltroPlaca] = useState('');
    const [filtroData, setFiltroData] = useState('');

    // --- Funções de Carregamento de Dados ---
    const getAlertas = async () => {
        try {
            const data = await fetchData(API_ENDPOINT); 
            setAlertas(data);
            setLoading(false);
        } catch (err) {
            console.error("Erro ao carregar alertas:", err);
            setError(err.message);
            setLoading(false);
        }
    };

    const fetchVeiculos = async () => {
        // Buscando veículos com dados básicos (placa/modelo) para o modal
        try {
    const data = await fetchData('veiculos/placas'); 
            setVeiculos(data);
        } catch (error) {
            console.error("Erro ao carregar veículos para o modal:", error);
        }
    };

    useEffect(() => {
        getAlertas();
        fetchVeiculos();
    }, []);

    // Função que o MODAL chamará no sucesso ou erro (PADRONIZADA)
    const handleAlertaSaved = (message, type) => {
        setNotification({ message, type });
        
        if (type === 'success') {
            getAlertas();
        }
    };

    // Função para fechar a notificação (passada para o Toast) (PADRONIZADA)
    const dismissNotification = () => setNotification(null);


    // --- Funções do Modal (PADRONIZADAS) ---

    const handleOpenModal = () => {
        setModalConfig({ alerta: null, mode: 'new' }); // Novo Cadastro
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalConfig({ alerta: null, mode: 'new' }); // Limpa o estado
        getAlertas(); // Recarrega a lista
    };

    // ----------------------------------------------------------------------
    // FUNÇÕES DE AÇÃO NA TABELA (CRUD - PADRONIZADAS)
    // ----------------------------------------------------------------------
    const handleVisualizar = (alerta) => {
        setModalConfig({ alerta: alerta, mode: 'view' }); 
        setIsModalOpen(true);
    };

    const handleEditar = (alerta) => {
        setModalConfig({ alerta: alerta, mode: 'edit' }); 
        setIsModalOpen(true);
    };

    const handleExcluir = async (alerta) => {
        if (window.confirm(`Tem certeza que deseja excluir o Alerta: ${alerta.tipo} em ${alerta.data}?`)) {
            try {
                // Usando sendData para DELETE
                await sendData('DELETE', `${API_ENDPOINT}/${alerta.id_alerta}`);
                handleAlertaSaved("Alerta excluído com sucesso!", 'success');
            } catch (error) {
                console.error("Erro ao excluir alerta:", error);
                handleAlertaSaved("Erro ao excluir alerta. Tente novamente.", 'error');
            }
        }
    };
    // ----------------------------------------------------------------------

    // --- Lógica de Filtro (Mantida) ---
    const alertasFiltrados = alertas.filter(alerta => {
        const placa = alerta.veiculo?.placa || '';
        const dataAlerta = alerta.data || '';
        
        const placaMatch = placa.toLowerCase().includes(filtroPlaca.toLowerCase());
        const dataMatch = filtroData ? dataAlerta === filtroData : true;
        
        return placaMatch && dataMatch;
    });

    if (loading) {
        return <div className="main-list-container">Carregando...</div>;
    }

    if (error) {
        return <div className="main-list-container">Erro: {error}</div>;
    }


    // --- Renderização com Classes Padronizadas ---

    return (
        <div className="main-list-container"> {/* CLASSE PADRONIZADA */}
            
            {/* Cabeçalho com Título e Botão (Classes já padronizadas) */}
            <div className="header-container">
                <h1 className="page-title">Cadastro de Alertas</h1>
                <button 
                    className="btn-novo-cadastro" // PADRONIZADO: Conforme Veiculo.js
                    onClick={handleOpenModal} // Chama a função padronizada
                >
                    <FaPlus /> Novo Cadastro
                </button>
            </div>

            {/* Área de Pesquisa (Classes já padronizadas) */}
            <div className="area-pesquisa-container">
                <h3 className="area-pesquisa-titulo">
                    <FaSearch /> Área de Pesquisa
                </h3>
                <div className="filtros-container">
                    <div className="filtro-item">
                        <label htmlFor="placa-veiculo">Placa do Veículo</label>
                        <input 
                            type="text" 
                            id="placa-veiculo" 
                            className="filtro-input" 
                            value={filtroPlaca}
                            onChange={(e) => setFiltroPlaca(e.target.value)}
                        />
                    </div>
                    <div className="filtro-item">
                        <label htmlFor="data-alerta">Data</label>
                        <input 
                            type="date" 
                            id="data-alerta" 
                            className="filtro-input" 
                            value={filtroData}
                            onChange={(e) => setFiltroData(e.target.value)}
                        />
                    </div>
                </div>
            </div>


            {/* Tabela de Alertas */}
            <div className="tabela-wrapper">
                {/* CLASSE PADRONIZADA */}
                <table className="tabela-listagem"> 
                    <thead>
                        <tr>
                            <th>Veículo</th>
                            <th>Tipo de Alerta</th>
                            <th>Descrição</th>
                            <th>Data do Alerta</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alertasFiltrados.length > 0 ? (
                            alertasFiltrados.map((alerta) => (
                                <tr key={alerta.id_alerta}>
                                    <td>{alerta.veiculo ? `${alerta.veiculo.modelo} - ${alerta.veiculo.placa}` : 'N/A'}</td>
                                    <td>{alerta.tipo}</td>
                                    <td>{alerta.descricao}</td>
                                    <td>{new Date(alerta.data).toLocaleDateString('pt-BR')}</td>
                                    <td className="acoes-cell">
                                        {/* BOTÕES PADRONIZADOS */}
                                        <button 
                                            className="action-button view-button" 
                                            title="Visualizar"
                                            onClick={() => handleVisualizar(alerta)}
                                        >
                                            <FaEye />
                                        </button>
                                        <button 
                                            className="action-button edit-button" 
                                            title="Editar"
                                            onClick={() => handleEditar(alerta)}
                                        >
                                            <FaEdit />
                                        </button>
                                        <button 
                                            className="action-button delete-button" 
                                            title="Excluir"
                                            onClick={() => handleExcluir(alerta)}
                                        >
                                            <FaTrashAlt />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                {/* CLASSE PADRONIZADA */}
                                <td colSpan="5" className="mensagem-tabela-vazia">Nenhum alerta encontrado.</td> 
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* RENDERIZAÇÃO CONDICIONAL DO MODAL */}
            {/*
            {isModalOpen && (
                <AlertaModal
                    onClose={handleCloseModal}
                    onAlertaSaved={handleAlertaSaved} // Função de callback padronizada
                    alertaToEdit={modalConfig.alerta} 
                    mode={modalConfig.mode}
                    veiculos={veiculos} // Passa a lista de veículos
                />
            )}
            */}
            
            {/* RENDERIZAÇÃO DO TOAST */}
            
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

export default Alerta;













/*===========================================================

import React, { useState, useEffect } from 'react';
import { FaSearch,FaEye ,FaPlus, FaEdit, FaTrash } from 'react-icons/fa'; 
//import './Alerta.css'; 
import { fetchData, sendData } from '../../service/api'; 
//import AlertaModal from './AlertaModal'; 
import '../style/style-pagina-principal.css';

const Alerta = () => {

    const API_ENDPOINT = '/api/alerta'; 
   
    const [alertas, setAlertas] = useState([]);  // Estado para a lista de alertas
    const [veiculos, setVeiculos] = useState([]);  // Estado para a lista de veículos (usado no modal)
    
    // Estado do Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [alertaParaEdicao, setAlertaParaEdicao] = useState(null);

    // Estado para Filtros (para futura implementação de busca)
    const [filtroPlaca, setFiltroPlaca] = useState('');
    const [filtroData, setFiltroData] = useState('');

    //Estado para configurar o modal (veículo e modo de operação)
    const [modalConfig, setModalConfig] = useState({ 
        veiculo: null, 
        mode: 'new'    // 'new', 'view', 'edit'
    });

    
    //Função para recarregar a lista de Alertas
    const getAlertas = async () => {
        try {
            // Buscando dados reais da API
            const data = await fetchData('alertas');
            setAlertas(data);
        } catch (error) {
            console.error("Erro ao carregar alertas:", error);
        }
    };
    
    const fetchVeiculos = async () => {
        try {
            // Buscando veículos com dados básicos (placa/modelo) para o modal
            const data = await fetchData('veiculos/placas'); 
            setVeiculos(data);
        } catch (error) {
            console.error("Erro ao carregar veículos:", error);
        }
    };
  
    useEffect(() => {
        getAlertas();
        
    }, []);

    
    // FUNÇÕES PARA ABRIR/FECHAR O MODAL
    const handleOpenModal = (alerta = null) => {
        setModalConfig(alerta); // Se for nulo, é um novo cadastro
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalConfig(null);
       // fetchAlertas(); // Recarrega a lista após fechar o modal (cadastro/edição)
    };

    // ----------------------------------------------------------------------
    // FUNÇÕES DE AÇÃO NA TABELA (CRUD)
    // --
    const handleVisualizar = (alerta) => {
        // Ação: Define o alerta e o modo 'view'
        setModalConfig({ alerta: alerta, mode: 'view' }); 
        setIsModalOpen(true);
    };

     const handleEditar = (alerta) => {
        // Ação: Define o alerta e o modo 'edit'
        setModalConfig({ alerta: alerta, mode: 'edit' }); 
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este alerta?')) {
            try {
                // Usando sendData para DELETE
                await sendData('DELETE', `alertas/${id}`);
                //fetchAlertas(); // Recarrega a lista
            } catch (error) {
                console.error("Erro ao excluir alerta:", error);
                alert("Falha ao excluir o alerta.");
            }
        }
    };

    // --- Lógica de Filtro (Ainda não implementada no Backend, apenas no Frontend) ---
    
    // Filtra a lista localmente (pode ser substituído por uma chamada de API futuramente)
    const alertasFiltrados = alertas.filter(alerta => {
        const placa = alerta.veiculo?.placa || '';
        const dataAlerta = alerta.data || '';
        
        const placaMatch = placa.toLowerCase().includes(filtroPlaca.toLowerCase());
        const dataMatch = filtroData ? dataAlerta === filtroData : true;
        
        return placaMatch && dataMatch;
    });

    // --- Renderização ---

    return (
        <div className="main-list-container">
            {/* Cabeçalho com Título e Botão 
            <div className="header-container">
                <h1 className="page-title">Cadastro de Alertas</h1>
                <button className="btn-novo-cadastro" onClick={() => handleOpenModal(null)}>
                    <FaPlus /> Novo Cadastro
                </button>
            </div>

            {/* Área de Pesquisa *
            <div className="area-pesquisa-container">
                <h3 className="area-pesquisa-titulo">
                    <FaSearch /> Área de Pesquisa
                </h3>

                {/* Área de Filtros *
                <div className="filtros-container">
                    <div className="filtro-item">
                        <label htmlFor="placa-veiculo">Placa do Veículo</label>
                        <input 
                            type="text" 
                            id="placa-veiculo" 
                            className="filtro-input" 
                            value={filtroPlaca}
                            onChange={(e) => setFiltroPlaca(e.target.value)}
                        />
                    </div>
                    <div className="filtro-item">
                        <label htmlFor="data-alerta">Data</label>
                        <input 
                            type="date" 
                            id="data-alerta" 
                            className="filtro-input" 
                            value={filtroData}
                            onChange={(e) => setFiltroData(e.target.value)}
                        />
                    </div>
                </div>
            </div>


            {/* Tabela de Alertas *
            <div className="tabela-wrapper">
                <table className="tabela-listagem">
                    <thead>
                        <tr>
                            <th>Veículo</th>
                            <th>Tipo de Alerta</th>
                            <th>Descrição</th>
                            <th>Data do Alerta</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alertasFiltrados.map((alerta) => (
                            <tr key={alerta.id_alerta}>
                                <td>{alerta.veiculo ? `${alerta.veiculo.modelo} - ${alerta.veiculo.placa}` : 'N/A'}</td>
                                <td>{alerta.tipo}</td>
                                <td>{alerta.descricao}</td>
                                <td>{new Date(alerta.data).toLocaleDateString('pt-BR')}</td>
                                <td className="acoes-cell">
                                     <button 
                                        className="action-button view-button" 
                                        title="Visualizar" 
                                        onClick={() => handleVisualizar(alerta)} // Chamada ajustada
                                    >
                                        <FaEye />
                                    </button>
                                    <button 
                                        className="action-button edit-button" 
                                        onClick={() => handleOpenModal(alerta)}
                                        title="Editar"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button 
                                        className="action-button delete-button" 
                                        onClick={() => handleDelete(alerta.id_alerta)}
                                        title="Excluir"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {alertas.length === 0 && (
                    <p className="tabela-vazia-mensagem">Nenhum alerta cadastrado.</p>
                )}
            </div>
            
            {/* Modal 
            {isModalOpen && (
                <AlertaModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    alertaData={alertaParaEdicao}
                    veiculos={veiculos} // Passa a lista de veículos para o select
                />
            )}
                

        </div>
    );
};


export default Alerta;

*/













/*===========================================================

import React, { useState, useEffect } from 'react';
import { FaSearch, FaPlus, FaEdit, FaTrash } from 'react-icons/fa'; 
import './Alerta.css'; 
import { fetchData, sendData } from '../../service/api'; 
//import AlertaModal from './AlertaModal'; 

const Alerta = () => {
   
    const [alertas, setAlertas] = useState([]);  // Estado para a lista de alertas
    const [veiculos, setVeiculos] = useState([]);  // Estado para a lista de veículos (usado no modal)
    
    // Estado do Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [alertaParaEdicao, setAlertaParaEdicao] = useState(null);

    // Estado para Filtros (para futura implementação de busca)
    const [filtroPlaca, setFiltroPlaca] = useState('');
    const [filtroData, setFiltroData] = useState('');

    // --- Funções de Carregamento de Dados ---
    
    const fetchAlertas = async () => {
        try {
            // Buscando dados reais da API
            const data = await fetchData('alertas');
            setAlertas(data);
        } catch (error) {
            console.error("Erro ao carregar alertas:", error);
        }
    };

    const fetchVeiculos = async () => {
        try {
            // Buscando veículos com dados básicos (placa/modelo) para o modal
            const data = await fetchData('veiculos/placas'); 
            setVeiculos(data);
        } catch (error) {
            console.error("Erro ao carregar veículos:", error);
        }
    };

    useEffect(() => {
        fetchAlertas();
        fetchVeiculos();
    }, []);

    // --- Funções do Modal ---

    const handleOpenModal = (alerta = null) => {
        setAlertaParaEdicao(alerta); // Se for nulo, é um novo cadastro
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setAlertaParaEdicao(null);
        fetchAlertas(); // Recarrega a lista após fechar o modal (cadastro/edição)
    };

    // --- Funções CRUD (Ações) ---

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este alerta?')) {
            try {
                // Usando sendData para DELETE
                await sendData('DELETE', `alertas/${id}`);
                fetchAlertas(); // Recarrega a lista
            } catch (error) {
                console.error("Erro ao excluir alerta:", error);
                alert("Falha ao excluir o alerta.");
            }
        }
    };

    // --- Lógica de Filtro (Ainda não implementada no Backend, apenas no Frontend) ---
    
    // Filtra a lista localmente (pode ser substituído por uma chamada de API futuramente)
    const alertasFiltrados = alertas.filter(alerta => {
        const placa = alerta.veiculo?.placa || '';
        const dataAlerta = alerta.data || '';
        
        const placaMatch = placa.toLowerCase().includes(filtroPlaca.toLowerCase());
        const dataMatch = filtroData ? dataAlerta === filtroData : true;
        
        return placaMatch && dataMatch;
    });

    // --- Renderização ---

    return (
        <div className="alertas-container">
            {/* Cabeçalho com Título e Botão 
            <div className="header-container">
                <h1 className="page-title">Cadastro de Alertas</h1>
                <button 
                    className="btn-nova-solicitacao" 
                    onClick={() => handleOpenModal(null)}
                >
                    <FaPlus /> Novo Cadastro
                </button>
            </div>

            {/* Área de Pesquisa *
            <div className="area-pesquisa-container">
                <h3 className="area-pesquisa-titulo">
                    <FaSearch /> Área de Pesquisa
                </h3>

                {/* Área de Filtros *
                <div className="filtros-container">
                    <div className="filtro-item">
                        <label htmlFor="placa-veiculo">Placa do Veículo</label>
                        <input 
                            type="text" 
                            id="placa-veiculo" 
                            className="filtro-input" 
                            value={filtroPlaca}
                            onChange={(e) => setFiltroPlaca(e.target.value)}
                        />
                    </div>
                    <div className="filtro-item">
                        <label htmlFor="data-alerta">Data</label>
                        <input 
                            type="date" 
                            id="data-alerta" 
                            className="filtro-input" 
                            value={filtroData}
                            onChange={(e) => setFiltroData(e.target.value)}
                        />
                    </div>
                </div>
            </div>


            {/* Tabela de Alertas *
            <div className="tabela-wrapper">
                <table className="tabela-alertas">
                    <thead>
                        <tr>
                            <th>Veículo</th>
                            <th>Tipo de Alerta</th>
                            <th>Descrição</th>
                            <th>Data do Alerta</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alertasFiltrados.map((alerta) => (
                            <tr key={alerta.id_alerta}>
                                <td>{alerta.veiculo ? `${alerta.veiculo.modelo} - ${alerta.veiculo.placa}` : 'N/A'}</td>
                                <td>{alerta.tipo}</td>
                                <td>{alerta.descricao}</td>
                                <td>{new Date(alerta.data).toLocaleDateString('pt-BR')}</td>
                                <td className="acoes-cell">
                                    <button 
                                        className="btn-acao editar" 
                                        onClick={() => handleOpenModal(alerta)}
                                        title="Editar"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button 
                                        className="btn-acao excluir" 
                                        onClick={() => handleDelete(alerta.id_alerta)}
                                        title="Excluir"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {alertas.length === 0 && (
                    <p className="tabela-vazia-mensagem">Nenhum alerta cadastrado.</p>
                )}
            </div>
            
            {/* Modal 
            {isModalOpen && (
                <AlertaModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    alertaData={alertaParaEdicao}
                    veiculos={veiculos} // Passa a lista de veículos para o select
                />
            )}
                

        </div>
    );
};

// Renomeando para Alertas
export default Alerta;

*/




/*
import React from 'react';
import { FaSearch } from 'react-icons/fa'; // Importa o ícone de lupa

import './Alertas.css'; // Arquivo de estilos que também vamos criar

const Solicitacoes = () => {

  // Dados fictícios para a tabela
  const manutencaoCadastrada = [
  { id: 1, veiculo: 'Onix - ART-2025', tipo_alerta: 'Manutenção', descricao: 'Troca de Oleo', data_alerta: '01/01/2026' },
  { id: 2, veiculo: 'Gol - BRT-1024', tipo_alerta: 'Manutenção', descricao: 'Reparo no freio', data_alerta: '24/12/2025'},
  { id: 3, veiculo: 'Hilux - CDE-5678', tipo_alerta: 'Manutenção', descricao: 'Pintura', data_alerta: '02/03/2026'},
  
];

  // Função para renderizar a etiqueta de status com a cor correta
  const renderStatus = (status) => {
    const statusClasses = {
      'Aprovado': 'status-aprovado',
      'Aguardando': 'status-aguardando',
      'Rejeitado': 'status-rejeitado',
    };
    return <span className={`status-pill ${statusClasses[status] || ''}`}>{status}</span>;
  };

  return (
    <div className="solicitacoes-container">
      {/* Cabeçalho com Título e Botão *
      <div className="header-container">
        <h1 className="page-title">Cadastro de Alertas</h1>
        <button className="btn-nova-solicitacao">Novo Cadastro</button>
      </div>

      {/* Área de Pesquisa*
        <div className="area-pesquisa-container">
          <h3 className="area-pesquisa-titulo">
            <FaSearch /> Área de Pesquisa
          </h3>

          {/* Área de Filtros *
          <div className="filtros-container">
            <div className="filtro-item">
              <label htmlFor="nome-solicitante">Placa do Veículo</label>
              <input type="text" id="nome-solicitante" className="filtro-input" />
            </div>
            <div className="filtro-item">
              <label htmlFor="data-solicitacao">Data</label>
              <input type="date" id="data-solicitacao" className="filtro-input" />
            </div>
            
          </div>

        </div>


      {/* Tabela de Solicitações *
      <div className="tabela-wrapper">
        <table className="tabela-solicitacoes">
          <thead>
            <tr>
              <th>Veiculo</th>
              <th>Tipo de alerta</th>
              <th>Descrição</th>
              <th>Data do alerta</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {manutencaoCadastrada.map((sol) => (
              <tr key={sol.id}>
                <td>{sol.veiculo}</td>
                <td>{sol.tipo_alerta}</td>
                <td>{sol.descricao}</td>
                <td>{sol.data_alerta}</td>
                <td className="acoes-cell">
                  {/* Espaço para futuros ícones de ação *
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Solicitacoes;


*/