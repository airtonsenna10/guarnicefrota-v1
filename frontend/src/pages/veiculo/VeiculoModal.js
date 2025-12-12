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
                    {/* .................. */}
                    <div className="form-grid">
                        {/*............... */}
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
                            {/* O maxLength ajuda a limitar a entrada (opcional) */}
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




















/*

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
    
    
    // Atualiza o estado quando um campo muda
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    //  FUNÇÃO PRINCIPAL: Envia dados para o Backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const normalizeEnum = (value) => {
            // ... (sua lógica de normalização)
            if (!value) return '';
            return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s/g, '_');
        };

        const kmlValue = formData.kml ? String(formData.kml).replace(',', '.') : null;

        const dataToSend = {
            ...formData,
            status: normalizeEnum(formData.status), 
            propriedade: normalizeEnum(formData.propriedade),
            categoria: normalizeEnum(formData.categoria),
            kml: kmlValue ? parseFloat(kmlValue) : null,
        };

        try {
            await sendData('/api/veiculos', 'POST', dataToSend);
            
            setIsSubmitting(false);

            //  CHAMA O CALLBACK DO PAI: O pai exibe o Toast e recarrega a lista
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

    // Opções dos dropdowns (mantidas)
    const tiposVeiculo = ["Carro", "Utilitário", "Moto", "Van", "Micro-ônibus", "Ônibus", "Caminhão"];
    const statusOpcoes = ["Disponível", "Em Uso", "Em Manutenção", "Inativo"];
    const propriedades = ["Próprio", "Cedido", "Alugado"];
    const categorias = ["Elétrico", "Híbrido", "Flex", "Álcool", "Gasolina", "Diesel", "GNV"];


    return (
        <div className="modal-overlay">
            {isSubmitting && <LoadingOverlay message="Salvando..." />}

            <div className="modal-content">
                <h2>Novo Cadastro de Veículo</h2>
                <form onSubmit={handleSubmit}>
                
                    <div className="form-grid">
                    
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
                            <input type="text" id="placa" value={formData.placa} onChange={handleChange} required />
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
                            <input type="text" id="chassi" value={formData.chassi} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="renavam">Renavam</label>
                            <input type="text" id="renavam" value={formData.renavam} onChange={handleChange} />
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



























/*codigo antigo

import React, { useState } from 'react';
import './VeiculoModal.css';
import LoadingOverlay from '../loadingoverlay/LoadingOverlay';
import NotificationToast from '../loadingoverlay/NotificationToast';
import { sendData } from '../../service/api'; //  Importa a função de POST

// Mapeamento dos campos do formulário para o formato JSON esperado pelo Spring Boot
const VeiculoModal = ({ onClose }) => {
    
    const [formData, setFormData] = useState({
        // Inicializa todos os campos com valores iniciais/vazios
        modelo: '',
        marca: '',
        placa: '',
        tipoVeiculo: 'Carro', // Valor padrão
        capacidade: '',
        status: 'Disponível', // Valor padrão
        chassi: '',
        renavam: '',
        dataAquisicao: '',
        propriedade: 'Próprio', // Valor padrão
        categoria: 'Flex', // Ajuste o valor padrão conforme seu ENUM (Minúsculo para ENUM)
        kml: '',
        ultimaRevisao: '', // O campo no seu backend é 'ultimaRevisao'
    });
    
    // Estado para controlar o overlay de loading
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Gerencia a Notificação (Toast)
    const [notification, setNotification] = useState(null);

    // Função para fechar a notificação (passada para o Toast)
    const dismissNotification = () => setNotification(null);
    
    // Atualiza o estado quando um campo muda
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    //  FUNÇÃO PRINCIPAL: Envia dados para o Backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Função auxiliar para limpar o texto e formatar para o Enum do Java (minúsculas, underscore, sem acento)
        const normalizeEnum = (value) => {
            if (!value) return '';
            return value
                .toLowerCase()
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove acentos (Ex: 'Próprio' -> 'proprio')
                .replace(/\s/g, '_'); // Substitui espaços por underscore (Ex: 'em uso' -> 'em_uso')
        };

        // CORREÇÃO CRÍTICA: Troca a vírgula do KML por ponto para o padrão numérico do JSON/Java
        const kmlValue = formData.kml ? String(formData.kml).replace(',', '.') : null;

        // Mapeamento final dos ENUMS para o backend (garantindo que estejam em minúsculas)
        const dataToSend = {
            ...formData,
           
            // 1. CORREÇÃO ENUMS: Normaliza os valores para o formato 'disponivel', 'em_uso', 'proprio', 'eletrico', etc.
            status: normalizeEnum(formData.status), 
            propriedade: normalizeEnum(formData.propriedade),
            categoria: normalizeEnum(formData.categoria),
            
            // 2. CORREÇÃO KML: Envia o valor já formatado com ponto decimal
            kml: kmlValue ? parseFloat(kmlValue) : null,
            
           
        };

        try {
            // Chama o endpoint de POST do Spring Boot: /api/veiculos
            const savedVeiculo = await sendData('/api/veiculos', 'POST', dataToSend);
            
            // 1. DESATIVA O LOADING (Isso acontece instantaneamente)
            setIsSubmitting(false);

            // 2. EXIBE O TOAST DE SUCESSO (Não bloqueia o script)
            setNotification({ message: "Veículo cadastrado com sucesso!", type: 'success' });
            
            // 3. FECHA O MODAL IMEDIATAMENTE APÓS O SUCESSO
            onClose();

        } catch (error) {
            console.error("Erro ao salvar veículo:", error);

            // 1. DESATIVA O LOADING
            setIsSubmitting(false);

            // 2. EXIBE O TOAST DE ERRO
            setNotification({ 
                message: `❌ Erro ao cadastrar veículo. Verifique os dados.`, 
                type: 'error' 
            });
        } 
    };

    // Opções dos dropdowns (melhor definidas fora do return para organização)
    const tiposVeiculo = ["Carro", "Utilitário", "Moto", "Van", "Micro-ônibus", "Ônibus", "Caminhão"];
    const statusOpcoes = ["Disponível", "Em Uso", "Em Manutenção", "Inativo"];
    const propriedades = ["Próprio", "Cedido", "Alugado"];
    const categorias = ["Elétrico", "Híbrido", "Flex", "Álcool", "Gasolina", "Diesel", "GNV"];


    return (
        <div className="modal-overlay">
          {/* Renderiza o overlay de loading APENAS se isSubmitting for TRUE *
            {isSubmitting && <LoadingOverlay message="Salvando..." />}
            {/* Renderiza a notificação (Toast) se existir 
            {notification && 
                <NotificationToast
                    message={notification.message}
                    type={notification.type}
                    onDismiss={dismissNotification}
                    duration={6000} //Duração em milissegundos
                />
            }

            <div className="modal-content">
                <h2>Novo Cadastro de Veículo</h2>
                {/* Conecta a função handleSubmit ao formulário 
                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        
                        {/* INPUTS e SELECTS: Conectados via value e onChange={handleChange} 
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
                            <input type="text" id="placa" value={formData.placa} onChange={handleChange} required />
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
                            <input type="text" id="chassi" value={formData.chassi} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="renavam">Renavam</label>
                            <input type="text" id="renavam" value={formData.renavam} onChange={handleChange} />
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
                        {/* Desabilita os botões durante o envio 
                        <button type="button" onClick={onClose} disabled={isSubmitting}>Cancelar</button>
                        <button type="submit" disabled={isSubmitting}>Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VeiculoModal;











/*
import React from 'react';
import './VeiculoModal.css';

const VeiculoModal = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Novo Cadastro de Veículo</h2>
        <form>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="modelo">Modelo</label>
              <input type="text" id="modelo" />
            </div>
            <div className="form-group">
              <label htmlFor="marca">Marca</label>
              <input type="text" id="marca" />
            </div>
            <div className="form-group">
              <label htmlFor="placa">Placa</label>
              <input type="text" id="placa" />
            </div>
            <div className="form-group">
              <label htmlFor="tipoVeiculo">Tipo de Veículo</label>
              <select id="tipoVeiculo">
                <option>Carro</option>
                <option>Utilitário</option>
                <option>Moto</option>
                <option>Van</option>
                <option>Micro-ônibus</option>
                <option>Ônibus</option>
                <option>Caminhão</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="capacidade">Capacidade</label>
              <input type="number" id="capacidade" />
            </div>
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select id="status">
                <option>Disponível</option>
                <option>Em Uso</option>
                <option>Em Manutenção</option>
                <option>Inativo</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="chassi">Chassi</label>
              <input type="text" id="chassi" />
            </div>
            <div className="form-group">
              <label htmlFor="renavam">Renavam</label>
              <input type="text" id="renavam" />
            </div>
            <div className="form-group">
              <label htmlFor="dataAquisicao">Data da Aquisição</label>
              <input type="date" id="dataAquisicao" />
            </div>
            <div className="form-group">
              <label htmlFor="propriedade">Propriedade</label>
              <select id="propriedade">
                <option>Próprio</option>
                <option>Terceirizado</option>
                <option>Alugado</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="categoria">Categoria</label>
              <select id="propriedade">
                <option>Elétrico</option>
                <option>Híbrido</option>
                <option>Flex</option>
                <option>Álcool</option>
                <option>Gasolina</option>
                <option>Diesel</option>
                <option>GNV</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="kml">Km/l</label>
              <input type="number" id="kml" />
            </div>
            <div className="form-group">
              <label htmlFor="dataAquisicao">Última Revisão</label>
              <input type="date" id="dataAquisicao" />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VeiculoModal;

*/