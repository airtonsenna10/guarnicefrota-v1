import React, { useState, useEffect } from 'react';
import { FaSearch, FaPlus, FaEdit, FaTrash } from 'react-icons/fa'; 
import './Alertas.css'; 
// Serviço de API Padronizado
import { fetchData, sendData } from '../../service/api'; 
// Modal de Cadastro/Edição
//import AlertaModal from './AlertaModal'; 

const Alertas = () => {
   
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
            {/* Cabeçalho com Título e Botão */}
            <div className="header-container">
                <h1 className="page-title">Cadastro de Alertas</h1>
                <button 
                    className="btn-nova-solicitacao" 
                    onClick={() => handleOpenModal(null)}
                >
                    <FaPlus /> Novo Cadastro
                </button>
            </div>

            {/* Área de Pesquisa */}
            <div className="area-pesquisa-container">
                <h3 className="area-pesquisa-titulo">
                    <FaSearch /> Área de Pesquisa
                </h3>

                {/* Área de Filtros */}
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
                */}

        </div>
    );
};

// Renomeando para Alertas
export default Alertas;






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