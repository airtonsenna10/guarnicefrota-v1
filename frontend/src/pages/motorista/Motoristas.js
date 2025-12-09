import React from 'react';
import { FaSearch } from 'react-icons/fa'; // Importa o ícone de lupa

import './Motoristas.css'; // Arquivo de estilos que também vamos criar

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
      {/* Cabeçalho com Título e Botão */}
      <div className="header-container">
        <h1 className="page-title">Cadastro de Colaboradores</h1>
        <button className="btn-nova-solicitacao">Novo Cadastro</button>
      </div>

      {/* Área de Pesquisa - NOVO CONTAINER */}
        <div className="area-pesquisa-container">
          <h3 className="area-pesquisa-titulo">
            <FaSearch /> Área de Pesquisa
          </h3>

          {/* Área de Filtros */}
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


      {/* Tabela de Solicitações */}
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
                  {/* Espaço para futuros ícones de ação */}
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
