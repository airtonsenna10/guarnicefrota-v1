import React, { useState, useEffect } from 'react';
import { FaSearch, FaPlus, FaPhone, FaEnvelope, FaCar, FaUser, FaEllipsisV } from 'react-icons/fa'; 
import './Motorista.css'; 
import { fetchData, sendData } from '../../service/api'; 
//import MotoristaModal from './MotoristaModal'; 

const Motoristas = () => {
    const [motoristas, setMotoristas] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [motoristaParaEdicao, setMotoristaParaEdicao] = useState(null);

    // Estados de Filtro (Nome/CNH/Status)
    const [filtroBusca, setFiltroBusca] = useState('');
    const [filtroStatus, setFiltroStatus] = useState('Todos');

    // --- Carregamento de Dados ---
    
    const fetchMotoristas = async () => {
        try {
            // Supondo que o endpoint para motoristas seja 'motoristas'
            const data = await fetchData('motoristas'); 
            setMotoristas(data);
        } catch (error) {
            console.error("Erro ao carregar motoristas:", error);
        }
    };

    useEffect(() => {
        fetchMotoristas();
    }, []);

    // --- Funções do Modal ---

    const handleOpenModal = (motorista = null) => {
        setMotoristaParaEdicao(motorista); 
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setMotoristaParaEdicao(null);
        fetchMotoristas(); // Recarrega a lista após fechar
    };

    // --- Funções CRUD (Ações) ---
    
    // Ações de edição e exclusão serão feitas via Menu (...) no Card

    // --- Renderização de Componentes de Status ---
    
    const renderStatusPill = (status) => {
        // Status baseado na sua imagem (Ativo, Em viagem, Férias)
        const statusText = status ? status.toUpperCase() : 'N/A';
        const statusClasses = {
            'ATIVO': 'status-ativo',
            'EM VIAGEM': 'status-viagem',
            'FÉRIAS': 'status-ferias',
            'INATIVO': 'status-inativo',
        };
        return <span className={`status-pill ${statusClasses[statusText] || ''}`}>{statusText}</span>;
    };

    // --- Lógica de Filtro ---
    const motoristasFiltrados = motoristas.filter(motorista => {
        const nomeOuCnh = `${motorista.nome} ${motorista.cnh_categoria || ''}`.toLowerCase();
        
        const buscaMatch = nomeOuCnh.includes(filtroBusca.toLowerCase());
        const statusMatch = filtroStatus === 'Todos' || motorista.status?.toUpperCase() === filtroStatus.toUpperCase();
        
        return buscaMatch && statusMatch;
    });


    // --- Renderização ---

    return (
        <div className="motoristas-container">
            <div className="header-container">
                <h1 className="page-title">Cadastro de Motoristas</h1>
                <button 
                    className="btn-novo-cadastro" 
                    onClick={() => handleOpenModal(null)}
                >
                    <FaPlus /> Novo Cadastro
                </button>
            </div>

            {/* Área de Pesquisa/Filtros */}
            <div className="area-pesquisa-container">
                <h3 className="area-pesquisa-titulo">
                    <FaSearch /> Área de Pesquisa
                </h3>

                <div className="filtros-container">
                    <div className="filtro-item">
                        <label htmlFor="busca-motorista">Nome ou Categoria CNH</label>
                        <input 
                            type="text" 
                            id="busca-motorista" 
                            className="filtro-input" 
                            placeholder="Buscar por nome ou CNH"
                            value={filtroBusca}
                            onChange={(e) => setFiltroBusca(e.target.value)}
                        />
                    </div>
                    <div className="filtro-item">
                        <label htmlFor="status">Status</label>
                        <select 
                            id="status" 
                            className="filtro-input"
                            value={filtroStatus}
                            onChange={(e) => setFiltroStatus(e.target.value)}
                        >
                            <option value="Todos">Todos</option>
                            <option value="Diponivel">Disponivel</option>
                            <option value="Indisponivel">Indisponivel</option>
                            <option value="Em Viagem">Em Viagem</option>
                            <option value="Inativo">Inativo</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Grid de Cards */}
            <div className="cards-grid">
                {motoristasFiltrados.map((motorista) => (
                    <div key={motorista.id_motorista} className="motorista-card">
                        
                        <div className="card-header">
                            <FaUser className="user-icon" />
                            <div className="card-info-main">
                                <h3>{motorista.nome}</h3>
                                <p>CNH: {motorista.cnh_categoria || 'N/A'}</p>
                            </div>
                            <div className="card-menu-dots" onClick={() => handleOpenModal(motorista)} title="Editar/Excluir">
                                <FaEllipsisV />
                            </div>
                        </div>

                        <div className="card-details">
                            <p><FaPhone /> {motorista.telefone || 'N/A'}</p>
                            <p><FaEnvelope /> {motorista.email || 'N/A'}</p>
                        </div>

                        <div className="card-footer">
                            {renderStatusPill(motorista.status)}
                            <span className="viagens-count"><FaCar /> {motorista.viagens_realizadas || 0} viagens</span>
                        </div>
                    </div>
                ))}
                {motoristas.length === 0 && (
                    <p className="no-data-message">Nenhum motorista cadastrado.</p>
                )}
            </div>
            
            {/* Modal 
            {isModalOpen && (
                <MotoristaModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    motoristaData={motoristaParaEdicao}
                />
            )}
              */}
        </div>
    );
};

export default Motoristas;











/*  Página de Motoristas - Lista de Motoristas Cadastrados

import React from 'react';
import { FaSearch } from 'react-icons/fa'; // Importa o ícone de lupa

import './Motoristas.css'; // Arquivo de estilos que também vamos criar

const Solicitacoes = () => {

  // Dados fictícios para a tabela
  const veiculosCadastrados = [
  { id: 1, nome: 'Flavio Santos', matricula: 'ma2025', setor: 'SAOFC', perfil: 'Servidor', status: 'Ativo' },
  { id: 2, nome: 'Airton Santos', matricula: 'ma2025', setor: 'SAOFC', perfil: 'Terceirizado', status: 'Ativo' },
  { id: 3, nome: 'Lucas Santos', matricula: 'ma2025', setor: 'SAOFC', perfil: 'Terceirizado', status: 'Ativo' },
  { id: 4, nome: 'Diego Santos', matricula: 'ma2025', setor: 'SAOFC', perfil: 'Servidor', status: 'Ativo' },
  { id: 5, nome: 'Mario Santos', matricula: 'ma2025', setor: 'SAOFC', perfil: 'Servidor', status: 'Ativo' },
  { id: 6, nome: 'Pedro Santos', matricula: 'ma2025', setor: 'SAOFC', perfil: 'Terceirizado', status: 'Ativo' },
];

  // Função para renderizar a etiqueta de status com a cor correta
  const renderStatus = (status) => {
    const statusClasses = {
      'Ativo': 'status-ativo',
      'Inativo': 'status-inativo',
    };
    return <span className={`status-pill ${statusClasses[status] || ''}`}>{status}</span>;
  };

  return (
    <div className="solicitacoes-container">
      {/* Cabeçalho com Título e Botão *
      <div className="header-container">
        <h1 className="page-title">Cadastro de Motoristas</h1>
        <button className="btn-novo-cadastro">Novo Cadastro</button>
      </div>

      {/* Área de Pesquisa*
        <div className="area-pesquisa-container">
          <h3 className="area-pesquisa-titulo">
            <FaSearch /> Área de Pesquisa
          </h3>

          {/* Área de Filtros *
          <div className="filtros-container">
            <div className="filtro-item">
              <label htmlFor="nome-colaborador">Nome</label>
              <input type="text" id="nome-colaborador" className="filtro-input" />
            </div>
            <div className="filtro-item">
              <label htmlFor="nome-setor">Setor</label>
              <input type="text" id="nome-setor" className="filtro-input" />
            </div>
            <div className="filtro-item">
              <label htmlFor="status-select">Status</label>
              <select id="status-select" className="filtro-select">
                <option>Todos</option>
                <option>Ativo</option>
                <option>Inativo</option>
              </select>
            </div>
          </div>

        </div>


      {/* Tabela de Moristas *
      <div className="tabela-wrapper">
        <table className="tabela-solicitacoes">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Matricula</th>
              <th>Setor</th>
              <th>Perfil</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {veiculosCadastrados.map((sol) => (
              <tr key={sol.id}>
                <td>{sol.nome}</td>
                <td>{sol.matricula}</td>
                <td>{sol.setor}</td>
                <td>{sol.perfil}</td>
                <td>{renderStatus(sol.status)}</td>
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