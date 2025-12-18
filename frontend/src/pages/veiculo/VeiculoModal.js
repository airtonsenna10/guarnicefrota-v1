
import React, { useState, useEffect } from 'react';
//import './VeiculoModal.css';
import '../style/style-pagina-modal.css'; // Importa o CSS Modal
import LoadingOverlay from '../loadingoverlay/LoadingOverlay'; 
import { sendData } from '../../service/api';
import { FaTimes } from 'react-icons/fa';

// Recebe as novas props: veiculoToEdit (dados) e mode ('new', 'view', 'edit')
const VeiculoModal = ({ onClose, onVeiculoSaved, veiculoToEdit, mode }) => {
    
    // 🔑 NOVAS VARIÁVEIS DE ESTADO E LÓGICA
    const isViewMode = mode === 'view';
    const isEditMode = mode === 'edit';
    const isNewMode = mode === 'new';
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Define o título do modal
    const modalTitle = isViewMode ? 'Dados Cadastrais do Veículo' : 
                       isEditMode ? 'Editar Veículo' : 
                       'Novo Cadastro de Veículo';


    // ----------------------------------------------------------------------
    // 1. ESTADO E useEffect (PREENCHIMENTO DE DADOS)
    // ----------------------------------------------------------------------

    const initialFormData = {
        modelo: '', marca: '', placa: '', tipoVeiculo: 'Carro', 
        capacidade: '', status: 'Disponível', chassi: '', renavam: '', 
        dataAquisicao: '', propriedade: 'Próprio', categoria: 'Flex', 
        kml: '', ultimaRevisao: '',
    };
    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        // Preenche o formulário se estiver em modo Edição ou Visualização
        if (veiculoToEdit && (isEditMode || isViewMode)) {
            // NOTE: Ajuste a normalização do status, propriedade, e categoria para exibir no dropdown
            // Ex: EM_MANUTENCAO deve voltar a ser "Em Manutenção"
            
            // Função auxiliar para reverter o ENUM para o texto legível (reverte o normalizeEnum do handleSubmit)
            const reverseNormalizeEnum = (value) => {
                if (!value) return '';
                // Ex: "EM_MANUTENCAO" -> "EM MANUTENCAO" -> "Em Manutencao"
                return value.replace(/_/g, ' ').toLowerCase().replace(/(^|\s)\S/g, l => l.toUpperCase());
            };
            
            setFormData({
                ...veiculoToEdit,
                // Mapeamento especial para ENUMs que foram formatados
                status: reverseNormalizeEnum(veiculoToEdit.status),
                propriedade: reverseNormalizeEnum(veiculoToEdit.propriedade),
                categoria: reverseNormalizeEnum(veiculoToEdit.categoria),
                // km/l e capacidade já são números/strings
                capacidade: veiculoToEdit.capacidade || '',
                kml: veiculoToEdit.kml || '',
            });
        } else if (isNewMode) {
            // Zera o formulário para novo cadastro
            setFormData(initialFormData);
        }
    }, [veiculoToEdit, mode, isEditMode, isViewMode, isNewMode]);


    // ----------------------------------------------------------------------
    // 2. handleChange (Desabilitar no modo Visualização)
    // ----------------------------------------------------------------------
    const handleChange = (e) => {
        // Ignora se for Visualização
        if (isViewMode) return; 
        
        const { id, value } = e.target;
        // ... (resto da lógica de capitalização e remoção de espaços mantida) ...
        let newValue = value; // Valor que será processado

        const identificationFields = ['placa', 'chassi', 'renavam'];
        const descriptionFields = ['modelo', 'marca', 'tipoVeiculo'];

        if (identificationFields.includes(id)) {
            newValue = newValue
                .toUpperCase()
                .trim()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/\s/g, ''); 
        } else if (descriptionFields.includes(id)) {
            newValue = newValue.toUpperCase().trim();
        }

        setFormData(prev => ({ ...prev, [id]: newValue }));
    };

    // ----------------------------------------------------------------------
    // 3. handleSubmit (POST vs PUT)
    // ----------------------------------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Não faz nada se for Visualização
        if (isViewMode) return; 
        
        setIsSubmitting(true);

        const normalizeEnum = (value) => {
            if (!value) return '';
            return value.toUpperCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/\s/g, '_'); 
        };

        const kmlValue = formData.kml ? String(formData.kml).replace(',', '.') : null;

        const dataToSend = {
            // Em modo Edição (PUT), precisamos do ID no corpo da requisição
            ...(isEditMode && veiculoToEdit.id && {id: veiculoToEdit.id}),
            ...formData,
            tipoVeiculo: formData.tipoVeiculo ? formData.tipoVeiculo.toUpperCase() : '',
            status: normalizeEnum(formData.status), 
            propriedade: normalizeEnum(formData.propriedade),
            categoria: normalizeEnum(formData.categoria),
            kml: kmlValue ? parseFloat(kmlValue) : null,
        };
        
        // Define o método e a URL
        const method = isEditMode ? 'PUT' : 'POST';
        const url = isEditMode ? `/api/veiculos/${veiculoToEdit.id}` : '/api/veiculos';
        
        const successMsg = isEditMode ? "Veículo atualizado com sucesso!" : "Veículo cadastrado com sucesso!";

        try {
            await sendData(url, method, dataToSend);
            
            setIsSubmitting(false);
            onVeiculoSaved(successMsg, 'success');
            onClose();

        } catch (error) {
            console.error(`Erro ao ${isEditMode ? 'atualizar' : 'cadastrar'} veículo:`, error);
            setIsSubmitting(false);
            
            const errorMsg = `Erro ao ${isEditMode ? 'atualizar' : 'cadastrar'} veículo. Verifique os dados.`;
            onVeiculoSaved(errorMsg, 'error');
        } 
    };

    // ----------------------------------------------------------------------
    // 4. Renderização do Modo Visualização
    // ----------------------------------------------------------------------

    const renderViewMode = () => (
        <div className="view-mode-details form-grid">
            <div className="form-group">
                <label>Modelo</label>
                <p>{formData.modelo}</p>
            </div>
            <div className="form-group">
                <label>Marca</label>
                <p>{formData.marca}</p>
            </div>
            <div className="form-group">
                <label>Placa</label>
                <p>{formData.placa}</p>
            </div>
            <div className="form-group">
                <label>Tipo de Veículo</label>
                <p>{formData.tipoVeiculo}</p>
            </div>
            <div className="form-group">
                <label>Capacidade</label>
                <p>{formData.capacidade}</p>
            </div>
            <div className="form-group">
                <label>Status</label>
                <p>{formData.status}</p>
            </div>
            <div className="form-group">
                <label>Chassi</label>
                <p>{formData.chassi}</p>
            </div>
            <div className="form-group">
                <label>Renavam</label>
                <p>{formData.renavam}</p>
            </div>
            <div className="form-group">
                <label>Data da Aquisição</label>
                <p>{formData.dataAquisicao}</p>
            </div>
            <div className="form-group">
                <label>Propriedade</label>
                <p>{formData.propriedade}</p>
            </div>
            <div className="form-group">
                <label>Categoria</label>
                <p>{formData.categoria}</p>
            </div>
            <div className="form-group">
                <label>Km/l</label>
                <p>{formData.kml}</p>
            </div>
            <div className="form-group">
                <label>Última Revisão</label>
                <p>{formData.ultimaRevisao}</p>
            </div>
        </div>
    );

    // Opções dos dropdowns (mantidas)
    const tiposVeiculo = ["Carro", "Utilitário", "Moto", "Van", "Micro-ônibus", "Ônibus", "Caminhão"];
    const statusOpcoes = ["Disponível", "Em Uso", "Em Manutenção", "Inativo"];
    const propriedades = ["Próprio", "Cedido", "Alugado"];
    const categorias = ["Elétrico", "Híbrido", "Flex", "Álcool", "Gasolina", "Diesel", "GNV"];

    
    // ----------------------------------------------------------------------
    // 5. Renderização Final do Modal
    // ----------------------------------------------------------------------
    
    return (
        <div className="modal-overlay">
            {isSubmitting && <LoadingOverlay message={isEditMode ? "Atualizando..." : "Salvando..."} />}

            <div className="modal-content">
                <h2>{modalTitle}</h2>
                {/*<button className="modal-close-btn" onClick={onClose}>&times;</button>*/}
                <button className="modal-close-btn" onClick={onClose} title="Fechar" ><FaTimes /> </button>
                
                {/* Renderiza o Modo Visualização OU o Formulário */}
                {isViewMode ? renderViewMode() : (
                    <form className='form-grid-principal' onSubmit={handleSubmit}>
                        <div className="form-grid">
                            
                            <div className="form-group">
                                <label htmlFor="modelo">Modelo</label>
                                <input type="text" id="modelo" value={formData.modelo} onChange={handleChange} required disabled={isViewMode} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="marca">Marca</label>
                                <input type="text" id="marca" value={formData.marca} onChange={handleChange} required disabled={isViewMode} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="placa">Placa</label>
                                <input type="text" id="placa" value={formData.placa} onChange={handleChange} required maxLength="8" disabled={isViewMode} /> 
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="tipoVeiculo">Tipo de Veículo</label>
                                <select id="tipoVeiculo" value={formData.tipoVeiculo} onChange={handleChange} disabled={isViewMode}>
                                    {tiposVeiculo.map(tipo => (<option key={tipo} value={tipo}>{tipo}</option>))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="capacidade">Capacidade</label>
                                <input type="number" id="capacidade" value={formData.capacidade} onChange={handleChange} required min="1" disabled={isViewMode} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="status">Status</label>
                                <select id="status" value={formData.status} onChange={handleChange} disabled={isViewMode}>
                                    {statusOpcoes.map(s => (<option key={s} value={s}>{s}</option>))}
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="chassi">Chassi</label>
                                <input type="text" id="chassi" value={formData.chassi} onChange={handleChange} maxLength="20" disabled={isViewMode} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="renavam">Renavam</label>
                                <input type="text" id="renavam" value={formData.renavam} onChange={handleChange} maxLength="11" disabled={isViewMode} />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="dataAquisicao">Data da Aquisição</label>
                                <input type="date" id="dataAquisicao" value={formData.dataAquisicao} onChange={handleChange} disabled={isViewMode} />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="propriedade">Propriedade</label>
                                <select id="propriedade" value={formData.propriedade} onChange={handleChange} disabled={isViewMode}>
                                    {propriedades.map(p => (<option key={p} value={p}>{p}</option>))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="categoria">Categoria</label>
                                <select id="categoria" value={formData.categoria} onChange={handleChange} disabled={isViewMode}>
                                    {categorias.map(c => (<option key={c} value={c}>{c}</option>))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="kml">Km/l</label>
                                <input type="number" id="kml" value={formData.kml} onChange={handleChange} step="0.01" disabled={isViewMode} />
                            </div>

                            <div className="form-group">
                                <label htmlFor="ultimaRevisao">Última Revisão</label>
                                <input type="date" id="ultimaRevisao" value={formData.ultimaRevisao} onChange={handleChange} disabled={isViewMode} />
                            </div>

                        </div>
                        <div className="modal-actions">
                            <button type="button" onClick={onClose} disabled={isSubmitting}>Cancelar</button>
                            {/* Oculta o botão Salvar/Atualizar se for Visualização */}
                            {(!isViewMode) && (
                                <button type="submit" disabled={isSubmitting}>
                                    {isEditMode ? 'Salvar Edição' : 'Salvar'}
                                </button>
                            )}
                        </div>
                    </form>
                )}
                
                {/* Botão Fechar/Cancelar no modo Visualização */}
                {isViewMode && (
                    <div className="modal-actions">
                        <button type="button" onClick={onClose}>Fechar</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VeiculoModal;





/*codigo - 1 funcionando antes das alterações

import React, { useState } from 'react';
import './VeiculoModal.css';
import LoadingOverlay from '../loadingoverlay/LoadingOverlay'; 
import { sendData } from '../../service/api';

//Recebe a prop onVeiculoSaved do componente pai
const VeiculoModal = ({ onClose, onVeiculoSaved }) => {
    
    const [formData, setFormData] = useState({
        // ... (campos do formulário)
        modelo: '', marca: '', placa: '', tipoVeiculo: 'Carro', 
        capacidade: '', status: 'Disponível', chassi: '', renavam: '', 
        dataAquisicao: '', propriedade: 'Próprio', categoria: 'Flex', 
        kml: '', ultimaRevisao: '',
    });
    
    // Estado para controlar o overlay de loading
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    
    // ATENÇÃO: FUNÇÃO ALTERADA PARA FORÇAR MAIÚSCULAS E PADRONIZAR DADOS
    const handleChange = (e) => {
        const { id, value } = e.target;
        let newValue = value; // Valor que será processado

        // Lista de campos que devem ser forçados para MAIÚSCULAS e SEM ESPAÇOS/ACENTOS (Identificação)
        const identificationFields = ['placa', 'chassi', 'renavam'];
        // Lista de campos de texto livre que devem ser forçados para MAIÚSCULAS e sem espaços nas pontas (Descrição)
        const descriptionFields = ['modelo', 'marca', 'tipoVeiculo'];

        if (identificationFields.includes(id)) {
            // Força MAIÚSCULAS, remove espaços, remove acentos (ideal para identificadores)
            newValue = newValue
                .toUpperCase()
                .trim()
                .normalize("NFD") // Normaliza para tratar acentos
                .replace(/[\u0300-\u036f]/g, "") // Remove acentos
                .replace(/\s/g, ''); // Remove todos os espaços
        } else if (descriptionFields.includes(id)) {
            // Força MAIÚSCULAS e remove espaços iniciais/finais (ideal para nomes e descrições)
            newValue = newValue.toUpperCase().trim();
        }
        // Para os campos de ENUM (status, categoria, propriedade), o valor é o texto do dropdown (Ex: "Disponível")
        // Este valor é normalizado dentro do handleSubmit ANTES de ser enviado.

        setFormData(prev => ({ ...prev, [id]: newValue }));
    };
    // FIM DA FUNÇÃO handleChange CORRIGIDA

    // ATENÇÃO: FUNÇÃO ALTERADA PARA USAR O CONVERSOR DO ENUM EM MAIÚSCULAS NO DB (SEM ESPAÇOS)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Função de normalização ajustada para o formato do DB (MAIÚSCULAS e separador _ se houver espaço)
        const normalizeEnum = (value) => {
            if (!value) return '';
            // Converte para MAIÚSCULAS, remove acentos e substitui espaços por UNDERSCORE (_)
            return value.toUpperCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .replace(/\s/g, '_'); // Ex: "Em Manutenção" -> "EM_MANUTENCAO"
        };

        const kmlValue = formData.kml ? String(formData.kml).replace(',', '.') : null;

        const dataToSend = {
            ...formData,
            // Adiciona capitalização explícita para tipoVeiculo ANTES do envio
             tipoVeiculo: formData.tipoVeiculo ? formData.tipoVeiculo.toUpperCase() : '',
            // Aplicamos a normalização MAIÚSCULAS/UNDERSCORE nos ENUMs para salvar no DB
            status: normalizeEnum(formData.status), 
            propriedade: normalizeEnum(formData.propriedade),
            categoria: normalizeEnum(formData.categoria),
            // Os campos de texto (placa, chassi, etc.) já estão em MAIÚSCULAS devido ao handleChange.
            kml: kmlValue ? parseFloat(kmlValue) : null,
        };

        try {
            await sendData('/api/veiculos', 'POST', dataToSend);
            
            setIsSubmitting(false);

            // CHAMA O CALLBACK DO PAI: O pai exibe o Toast e recarrega a lista
            onVeiculoSaved("Veículo cadastrado com sucesso!", 'success');
            
            // FECHA O MODAL SÓ DEPOIS DE INFORMAR O PAI
            onClose();

        } catch (error) {
            console.error("Erro ao salvar veículo:", error);

            setIsSubmitting(false);

            // CHAMA O CALLBACK DO PAI PARA EXIBIR ERRO
            onVeiculoSaved(` Erro ao cadastrar veículo. Verifique os dados.`, 'error');
            
            // O modal fica aberto para o usuário corrigir
        } 
    };

    // Opções dos dropdowns (mantidas, mas o normalizeEnum as transforma no formato do DB)
    const tiposVeiculo = ["Carro", "Utilitário", "Moto", "Van", "Micro-ônibus", "Ônibus", "Caminhão"];
    const statusOpcoes = ["Disponível", "Em Uso", "Em Manutenção", "Inativo"]; // Serão salvas como DISPONIVEL, EM_USO, etc.
    const propriedades = ["Próprio", "Cedido", "Alugado"]; // Serão salvas como PROPRIO, CEDIDO, etc.
    const categorias = ["Elétrico", "Híbrido", "Flex", "Álcool", "Gasolina", "Diesel", "GNV"]; // Serão salvas como ELETRICO, HIBRIDO, etc.


    return (
        <div className="modal-overlay">
            {isSubmitting && <LoadingOverlay message="Salvando..." />}

            <div className="modal-content">
                <h2>Novo Cadastro de Veículo</h2>
                <form onSubmit={handleSubmit}>
                    {/* .................. 
                    <div className="form-grid">
                        {/*............... 
                        <div className="form-group">
                             <label htmlFor="modelo">Modelo</label>
                             <input type="text" id="modelo" value={formData.modelo} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="marca">Marca</label>
                            <input type="text" id="marca" value={formData.marca} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="placa">Placa</label>
                            {/* O maxLength ajuda a limitar a entrada (opcional) 
                            <input type="text" id="placa" value={formData.placa} onChange={handleChange} required maxLength="8" /> 
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="tipoVeiculo">Tipo de Veículo</label>
                            <select id="tipoVeiculo" value={formData.tipoVeiculo} onChange={handleChange}>
                                {tiposVeiculo.map(tipo => (<option key={tipo} value={tipo}>{tipo}</option>))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="capacidade">Capacidade</label>
                            <input type="number" id="capacidade" value={formData.capacidade} onChange={handleChange} required min="1" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="status">Status</label>
                            <select id="status" value={formData.status} onChange={handleChange}>
                                {statusOpcoes.map(s => (<option key={s} value={s}>{s}</option>))}
                            </select>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="chassi">Chassi</label>
                            <input type="text" id="chassi" value={formData.chassi} onChange={handleChange} maxLength="20" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="renavam">Renavam</label>
                            <input type="text" id="renavam" value={formData.renavam} onChange={handleChange} maxLength="11" />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="dataAquisicao">Data da Aquisição</label>
                            <input type="date" id="dataAquisicao" value={formData.dataAquisicao} onChange={handleChange} />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="propriedade">Propriedade</label>
                            <select id="propriedade" value={formData.propriedade} onChange={handleChange}>
                                {propriedades.map(p => (<option key={p} value={p}>{p}</option>))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="categoria">Categoria</label>
                            <select id="categoria" value={formData.categoria} onChange={handleChange}>
                                {categorias.map(c => (<option key={c} value={c}>{c}</option>))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="kml">Km/l</label>
                            <input type="number" id="kml" value={formData.kml} onChange={handleChange} step="0.01" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="ultimaRevisao">Última Revisão</label>
                            <input type="date" id="ultimaRevisao" value={formData.ultimaRevisao} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="modal-actions">
                        <button type="button" onClick={onClose} disabled={isSubmitting}>Cancelar</button>
                        <button type="submit" disabled={isSubmitting}>Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VeiculoModal;

*/


















