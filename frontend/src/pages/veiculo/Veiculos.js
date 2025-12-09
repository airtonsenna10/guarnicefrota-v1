import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa'; // Importa o ícone de lupa
import { fetchData } from '../../service/api'; // Importa a função de busca de dados
import VeiculoModal from './VeiculoModal'; //  IMPORTAÇÃO DO MODAL
import './Veiculos.css'; // Arquivo de estilos

const Veiculos = () => {
    const [veiculos, setVeiculos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // NOVO ESTADO: Adicionado para controlar a visibilidade do modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const getVeiculos = async () => {
            try {
                const data = await fetchData('/api/veiculos');
                setVeiculos(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getVeiculos();
    }, []);

    // FUNÇÕES PARA ABRIR/FECHAR O MODAL
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // Função para renderizar a etiqueta de status com a cor correta para veículos
    const renderStatusVeiculo = (status) => {
        if (!status) return null;

        const normalizado = status
            .toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove acentos
            .replace(/[\s_]/g, "-"); // troca espaço/underscore por hífen

        let statusClass = '';
        switch (normalizado) {
            case 'disponivel':
                statusClass = 'status-disponivel';
                break;
            case 'em-uso':
                statusClass = 'status-em-uso';
                break;
            case 'em-manutencao':
                statusClass = 'status-em-manutencao';
                break;
            case 'inativo':
                statusClass = 'status-inativo';
                break;
            
            default:
                statusClass = 'status-desconhecido';
        }
        return <span className={`status-pill ${statusClass}`}>{status}</span>;
    };

    if (loading) {
        return <div className="solicitacoes-container">Carregando...</div>;
    }

    if (error) {
        return <div className="solicitacoes-container">Erro: {error}</div>;
    }

    return (
        <div className="solicitacoes-container">
            {/* Cabeçalho com Título e Botão */}
            <div className="header-container">
                <h1 className="page-title">Cadastro de Veículos</h1>
                {/* CONECTA A FUNÇÃO DE ABERTURA AO BOTÃO */}
                <button className="btn-nova-solicitacao" onClick={handleOpenModal}>Novo Cadastro</button>
            </div>

            {/* Área de Pesquisa */}
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
                        <label htmlFor="status-select">Status</label>
                        <select id="status-select" className="filtro-select">
                            <option>Todos</option>
                            <option>Disponível</option>
                            <option>Em Uso</option>
                            <option>Em Manutenção</option>
                            <option>Inativo</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Tabela de Veículos */}
            <div className="tabela-wrapper">
                <table className="tabela-veiculos">
                    <thead>
                        <tr>
                            <th>Modelo</th>
                            <th>Marca</th>
                            <th>Placa</th>
                            <th>Tipo de Veículo</th>
                            <th>Capacidade</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {veiculos.length > 0 ? (
                            veiculos.map((veiculo) => (
                                <tr key={veiculo.id}>
                                    <td>{veiculo.modelo}</td>
                                    <td>{veiculo.marca}</td>
                                    <td>{veiculo.placa}</td>
                                    <td>{veiculo.tipoVeiculo}</td>
                                    <td>{veiculo.capacidade}</td>
                                    <td>{renderStatusVeiculo(veiculo.status)}</td>
                                    <td className="acoes-cell">
                                        {/* Espaço para futuros ícones de ação */}
                                    </td>
                                </tr>
                            ))
                            ) : (
                                <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '1rem', color: '#6b7280' }}>
                                    Nenhum veículo cadastrado.
                                </td>
                                </tr>
                            ) 
                        }

                    </tbody>
                </table>
            </div>
            
            {/*RENDERIZAÇÃO CONDICIONAL DO MODAL */}
            {isModalOpen && (
                <VeiculoModal
                    onClose={handleCloseModal} // Passa a função para o modal fechar
                />
            )}
        </div>
    );
};

export default Veiculos;
