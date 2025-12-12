import React, { useState, useEffect } from 'react';
import { FaSearch, FaPlus, FaEdit, FaTrash } from 'react-icons/fa'; 
import './Setor.css'; 
import { fetchData, sendData } from '../../service/api'; 
//import SetorModal from './SetorModal'; 

const Setores = () => {
    const [setores, setSetores] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [setorParaEdicao, setSetorParaEdicao] = useState(null);

    // Estados de Filtro
    const [filtroNome, setFiltroNome] = useState('');

    // --- Funções de Carregamento de Dados ---
    
    const fetchSetores = async () => {
        try {
            // Supondo que o endpoint para setores (tb02_organograma) seja 'setores'
            const data = await fetchData('setores'); 
            // Para simplificar a exibição, vamos mapear a lista de setores para incluir o nome do setor pai
            const setoresComPai = data.map(setor => ({
                ...setor,
                nome_pai: setor.pai ? data.find(p => p.id === setor.pai)?.nome_setor || 'N/A' : 'Nenhum'
            }));

            setSetores(setoresComPai);
        } catch (error) {
            console.error("Erro ao carregar setores:", error);
        }
    };

    useEffect(() => {
        fetchSetores();
    }, []);

    // --- Funções do Modal ---

    const handleOpenModal = (setor = null) => {
        setSetorParaEdicao(setor); 
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSetorParaEdicao(null);
        fetchSetores(); // Recarrega a lista
    };

    // --- Funções CRUD (Ações) ---

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este setor? Isso pode afetar servidores e veículos ligados a ele.')) {
            try {
                // Supondo que o endpoint de exclusão seja 'setores/{id}'
                await sendData('DELETE', `setores/${id}`);
                fetchSetores();
            } catch (error) {
                console.error("Erro ao excluir setor:", error);
                alert("Falha ao excluir o setor. Verifique se há dependências (servidores/veículos).");
            }
        }
    };
    
    // --- Lógica de Filtro ---
    const setoresFiltrados = setores.filter(setor => {
        const nomeMatch = setor.nome_setor.toLowerCase().includes(filtroNome.toLowerCase());
        return nomeMatch;
    });

    // --- Renderização ---

    return (
        <div className="setores-container">
            <div className="header-container">
                <h1 className="page-title">Cadastro de Setores (Organograma)</h1>
                <button 
                    className="btn-novo-cadastro" 
                    onClick={() => handleOpenModal(null)}
                >
                    <FaPlus /> Novo Setor
                </button>
            </div>

            {/* Área de Pesquisa/Filtros */}
            <div className="area-pesquisa-container">
                <h3 className="area-pesquisa-titulo">
                    <FaSearch /> Área de Pesquisa
                </h3>
                <div className="filtros-container">
                    <div className="filtro-item">
                        <label htmlFor="nome-setor">Nome do Setor</label>
                        <input 
                            type="text" 
                            id="nome-setor" 
                            className="filtro-input" 
                            value={filtroNome}
                            onChange={(e) => setFiltroNome(e.target.value)}
                        />
                    </div>
                </div>
            </div>


            {/* Tabela de Setores */}
            <div className="tabela-wrapper">
                <table className="tabela-setores">
                    <thead>
                        <tr>
                            <th>Nome do Setor</th>
                            <th>Responsável</th>
                            <th>Descrição</th>
                             <th>Setor Pai</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {setoresFiltrados.map((setor) => (
                            <tr key={setor.id}>
                                <td>{setor.nome_setor}</td>
                                <td>{setor.responsavel}</td>
                                <td>{setor.descricao}</td>
                                <td>{setor.nome_pai}</td>
                                <td className="acoes-cell">
                                    <button 
                                        className="btn-acao editar" 
                                        onClick={() => handleOpenModal(setor)}
                                        title="Editar"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button 
                                        className="btn-acao excluir" 
                                        onClick={() => handleDelete(setor.id)}
                                        title="Excluir"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {setores.length === 0 && (
                    <p className="tabela-vazia-mensagem">Nenhum setor cadastrado.</p>
                )}
            </div>
            
            {/* Modal 
            {isModalOpen && (
                <SetorModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    setorData={setorParaEdicao}
                    allSetores={setores} // Passamos a lista para que o modal possa selecionar o Setor Pai
                />
            )}
                */}
        </div>
    );
};

export default Setores;