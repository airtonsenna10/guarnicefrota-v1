import React from 'react';
import { FaSearch } from 'react-icons/fa'; // Importa o ícone de lupa
import './Solicitacoes.css'; // Arquivo de estilos que também vamos criar

const Solicitacoes = () => {

  // Dados fictícios para a tabela
  const solicitacoesFicticias = [
    { id: 1, solicitante: 'João da Silva', data: '2024-07-22', origem: 'Garagem Central', destino: 'Centro Administrativo', status: 'Aprovado' },
    { id: 2, solicitante: 'Maria Oliveira', data: '2024-07-21', origem: 'Secretaria de Saúde', destino: 'Hospital Regional', status: 'Aguardando' },
    { id: 3, solicitante: 'Carlos Pereira', data: '2024-07-20', origem: 'Almoxarifado', destino: 'Oficina Mecânica', status: 'Rejeitado' },
    { id: 4, solicitante: 'Ana Costa', data: '2024-07-19', origem: 'Garagem Central', destino: 'Evento Externo', status: 'Aprovado' },
    { id: 5, solicitante: 'Pedro Martins', data: '2024-07-18', origem: 'Sede', destino: 'Reunião Externa', status: 'Aguardando' },
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
        <h1 className="page-title">Solicitações de Veículos</h1>
        <button className="btn-nova-solicitacao">Nova Solicitação</button>
      </div>

      {/* Área de Pesquisa - NOVO CONTAINER */}
      <div className="area-pesquisa-container">
        <h3 className="area-pesquisa-titulo">
            <FaSearch /> Área de Pesquisa
        </h3>

        {/* Filtros dentro do container de pesquisa */}
        <div className="filtros-container">
          <div className="filtro-item">
            <label htmlFor="nome-solicitante">Nome do solicitante</label>
            <input type="text" id="nome-solicitante" className="filtro-input" />
          </div>
          <div className="filtro-item">
            <label htmlFor="data-solicitacao">Data</label>
            <input type="date" id="data-solicitacao" className="filtro-input" />
          </div>
          <div className="filtro-item">
            <label htmlFor="status-select">Status</label>
            <select id="status-select" className="filtro-select">
              <option>Todos</option>
              <option>Aguardando</option>
              <option>Aprovado</option>
              <option>Rejeitado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabela de Solicitações */}
      <div className="tabela-wrapper">
        <table className="tabela-solicitacoes">
          <thead>
            <tr>
              <th>Solicitante</th>
              <th>Data da Solicitação</th>
              <th>Origem</th>
              <th>Destino</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {solicitacoesFicticias.map((sol) => (
              <tr key={sol.id}>
                <td>{sol.solicitante}</td>
                <td>{sol.data}</td>
                <td>{sol.origem}</td>
                <td>{sol.destino}</td>
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
