import React from 'react';
import { FaSearch } from 'react-icons/fa'; // Importa o ícone de lupa

import './Manutencoes.css'; // Arquivo de estilos que também vamos criar

const Manutencoes = () => {

  // Dados fictícios para a tabela
  const manutencaoCadastrada = [
  { id: 1, veiculo: 'Onix - ART-2025', tipo_manutencao: 'Troca de Oleo', descricao: 'xxxxxx', data_inicio: '02/01/2026', previsao_entrega: '05/01/2026', status: 'Não iniciado' },
  { id: 2, veiculo: 'Gol - BRT-1024', tipo_manutencao: 'Reparo no freio', descricao: 'xxxxxx', data_inicio: '25/12/2025', previsao_entrega: '29/12/2025', status: 'Não iniciado' },
  { id: 3, veiculo: 'Hilux - CDE-5678', tipo_manutencao: 'Pintura', descricao: 'xxxxxx', data_inicio: '03/03/2026', previsao_entrega: '03/04/2026', status: 'Não iniciado' },
  
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
    <div className="manutencoes-container">
      {/* Cabeçalho com Título e Botão */}
      <div className="header-container">
        <h1 className="page-title">Cadastro de Manutenção</h1>
        <button className="btn-nova-manutencao">Novo Cadastro</button>
      </div>

      {/* Área de Pesquisa - NOVO CONTAINER */}
        <div className="area-pesquisa-container">
          <h3 className="area-pesquisa-titulo">
            <FaSearch /> Área de Pesquisa
          </h3>

          {/* Área de Filtros */}
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


      {/* Tabela de Solicitações */}
      <div className="tabela-wrapper">
        <table className="tabela-manutencao">
          <thead>
            <tr>
              <th>Veiculo</th>
              <th>Tipo de manutenção</th>
              <th>Descrição</th>
              <th>Data de Inicio</th>
              <th>Previsão de Entrega</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {manutencaoCadastrada.map((sol) => (
              <tr key={sol.id}>
                <td>{sol.veiculo}</td>
                <td>{sol.tipo_manutencao}</td>
                <td>{sol.descricao}</td>
                <td>{sol.data_inicio}</td>
                <td>{sol.previsao_entrega}</td>
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

export default Manutencoes;
