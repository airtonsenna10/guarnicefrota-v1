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
