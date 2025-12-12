import React, { useState, useEffect } from 'react';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa'; 
import './Servidor.css'; 
import { fetchData, sendData } from '../../service/api'; 
//import ServidorModal from './ServidorModal'; // Iremos criar este arquivo

const Servidores = () => {
    // Estado para a lista de colaboradores (servidores)
    const [servidores, setServidores] = useState([]);
    
    // Estado do Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [servidorParaEdicao, setServidorParaEdicao] = useState(null);

    // Estados de Filtro (conforme sua imagem)
    const [filtroNome, setFiltroNome] = useState('');
    const [filtroSetor, setFiltroSetor] = useState('');
    const [filtroStatus, setFiltroStatus] = useState('Todos');

    // --- Carregamento de Dados ---
    
    const fetchServidores = async () => {
        try {
            // Supondo que o endpoint para servidores seja 'servidores'
            const data = await fetchData('servidores'); 
            setServidores(data);
        } catch (error) {
            console.error("Erro ao carregar colaboradores (servidores):", error);
        }
    };

    useEffect(() => {
        fetchServidores();
    }, []);

    // --- Funções do Modal ---

    const handleOpenModal = (servidor = null) => {
        setServidorParaEdicao(servidor); 
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setServidorParaEdicao(null);
        fetchServidores(); // Recarrega a lista após fechar
    };

    // --- Funções CRUD (Ações) ---

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este colaborador?')) {
            try {
                // Supondo que o endpoint de exclusão seja 'servidores/{id}'
                await sendData('DELETE', `servidores/${id}`);
                fetchServidores();
            } catch (error) {
                console.error("Erro ao excluir colaborador:", error);
                alert("Falha ao excluir o colaborador.");
            }
        }
    };
    
    // Função para renderizar o Status
    const renderStatus = (status) => {
        const statusClasses = {
            'ATIVO': 'status-ativo',
            'INATIVO': 'status-inativo',
            'AFASTADO': 'status-afastado',
        };
        return <span className={`status-pill ${statusClasses[status] || ''}`}>{status}</span>;
    };

    // --- Lógica de Filtro (Frontend - para demonstração) ---
    const servidoresFiltrados = servidores.filter(servidor => {
        const nomeMatch = servidor.nome.toLowerCase().includes(filtroNome.toLowerCase());
        const setorMatch = servidor.setor.toLowerCase().includes(filtroSetor.toLowerCase());
        const statusMatch = filtroStatus === 'Todos' || servidor.status === filtroStatus;
        
        return nomeMatch && setorMatch && statusMatch;
    });

    // --- Renderização ---

    return (
        <div className="servidores-container">
            <div className="header-container">
                <h1 className="page-title">Cadastro de Colaboradores</h1>
                <button 
                    className="btn-novo-cadastro" 
                    onClick={() => handleOpenModal(null)}
                >
                    <FaPlus /> Novo Cadastro
                </button>
            </div>

            {/* Área de Pesquisa/Filtros (Baseado na sua imagem) */}
            <div className="area-pesquisa-container">
                <h3 className="area-pesquisa-titulo">
                    <FaSearch /> Área de Pesquisa
                </h3>

                <div className="filtros-container">
                    <div className="filtro-item">
                        <label htmlFor="nome-colaborador">Nome</label>
                        <input 
                            type="text" 
                            id="nome-colaborador" 
                            className="filtro-input" 
                            value={filtroNome}
                            onChange={(e) => setFiltroNome(e.target.value)}
                        />
                    </div>
                    <div className="filtro-item">
                        <label htmlFor="setor">Setor</label>
                        <input 
                            type="text" 
                            id="setor" 
                            className="filtro-input" 
                            value={filtroSetor}
                            onChange={(e) => setFiltroSetor(e.target.value)}
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
                            <option value="ATIVO">ATIVO</option>
                            <option value="INATIVO">INATIVO</option>
                            <option value="AFASTADO">AFASTADO</option>
                        </select>
                    </div>
                </div>
            </div>


            {/* Tabela de Colaboradores */}
            <div className="tabela-wrapper">
                <table className="tabela-servidores">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Matrícula</th>
                            <th>Setor</th>
                            <th>Perfil</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {servidoresFiltrados.map((servidor) => (
                            <tr key={servidor.id_servidor}>
                                <td>{servidor.nome}</td>
                                <td>{servidor.matricula}</td>
                                <td>{servidor.setor}</td>
                                <td>{servidor.perfil}</td>
                                <td>{renderStatus(servidor.status)}</td>
                                <td className="acoes-cell">
                                    <button className="btn-acao visualizar" title="Visualizar">
                                        <FaEye />
                                    </button>
                                    <button 
                                        className="btn-acao editar" 
                                        onClick={() => handleOpenModal(servidor)}
                                        title="Editar"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button 
                                        className="btn-acao excluir" 
                                        onClick={() => handleDelete(servidor.id_servidor)}
                                        title="Excluir"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {servidores.length === 0 && (
                    <p className="tabela-vazia-mensagem">Nenhum colaborador cadastrado.</p>
                )}
            </div>
            
            {/* Modal 
            {isModalOpen && (
                <ServidorModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    servidorData={servidorParaEdicao}
                />
            )}

            */}
        </div>
    );
};

export default Servidores;






/*  Página de Servidores - Cadastro e Gerenciamento de Colaboradores - Original

import React from 'react';
import { FaSearch } from 'react-icons/fa'; // Importa o ícone de lupa

import './Servidores.css'; // Arquivo de estilos que também vamos criar

const Solicitacoes = () => {

  // Dados fictícios para a tabela
  const veiculosCadastrados = [
  { id: 1, nome: 'Flavio Santos', matricula: 'ma2025', setor: 'SAOFC', perfil: 'Servidor', status: 'Ativo' },
  { id: 2, nome: 'Flavio Santos', matricula: 'ma2025', setor: 'SAOFC', perfil: 'Servidor', status: 'Ativo' },
  { id: 3, nome: 'Flavio Santos', matricula: 'ma2025', setor: 'SAOFC', perfil: 'Servidor', status: 'Ativo' },
  { id: 4, nome: 'Flavio Santos', matricula: 'ma2025', setor: 'SAOFC', perfil: 'Servidor', status: 'Ativo' },
  { id: 5, nome: 'Flavio Santos', matricula: 'ma2025', setor: 'SAOFC', perfil: 'Servidor', status: 'Ativo' },
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
      {/* Cabeçalho com Título e Botão 
      <div className="header-container">
        <h1 className="page-title">Cadastro de Colaboradores</h1>
        <button className="btn-nova-solicitacao">Novo Cadastro</button>
      </div>

      {/* Área de Pesquisa - NOVO CONTAINER 
        <div className="area-pesquisa-container">
          <h3 className="area-pesquisa-titulo">
            <FaSearch /> Área de Pesquisa
          </h3>

          {/* Área de Filtros 
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


      {/* Tabela de Solicitações 
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
                  {/* Espaço para futuros ícones de ação 
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