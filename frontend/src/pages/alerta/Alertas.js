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
      {/* Cabeçalho com Título e Botão */}
      <div className="header-container">
        <h1 className="page-title">Cadastro de Alertas</h1>
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
              <label htmlFor="nome-solicitante">Placa do Veículo</label>
              <input type="text" id="nome-solicitante" className="filtro-input" />
            </div>
            <div className="filtro-item">
              <label htmlFor="data-solicitacao">Data</label>
              <input type="date" id="data-solicitacao" className="filtro-input" />
            </div>
            
          </div>

        </div>


      {/* Tabela de Solicitações */}
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
