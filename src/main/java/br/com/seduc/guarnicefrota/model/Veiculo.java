package br.com.seduc.guarnicefrota.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "tb06_veiculo")
public class Veiculo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_veiculo")
    private Long id;

    @Column(length = 45)
    private String modelo;

    @Column(length = 45)
    private String marca;

    @Column(length = 8)
    private String placa;

    @Column(length = 20)
    private String chassi;

    @Column(length = 11)
    private String renavan;

    @Column(name = "tipo_veiculo", length = 30)
    private String tipoVeiculo;

    private int capacidade;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "enum('disponivel','em_manutençao','em_uso','inativo')")
    private StatusVeiculo status;

    @Column(name = "data_aquisicao")
    private LocalDate dataAquisicao;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "enum('alugado','proprio','cedido')")
    private PropriedadeVeiculo propriedade;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "enum('alcool','diesel','eletrico','flex','gasolina','gnv','hibrido','hidrogenio')")
    private CategoriaVeiculo categoria;

    @Column(precision = 5, scale = 2)
    private BigDecimal kml;

    @Column(name = "ultima_revisao")
    private LocalDate ultimaRevisao;

    // ENUMS do banco
    public enum CategoriaVeiculo {
        alcool,diesel,eletrico,flex,gasolina,gnv,hibrido,hidrogenio
    }

    public enum PropriedadeVeiculo {
        alugado,proprio,cedido
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public String getPlaca() {
        return placa;
    }

    public void setPlaca(String placa) {
        this.placa = placa;
    }

    public String getChassi() {
        return chassi;
    }

    public void setChassi(String chassi) {
        this.chassi = chassi;
    }

    public String getRenavan() {
        return renavan;
    }

    public void setRenavan(String renavan) {
        this.renavan = renavan;
    }

    public String getTipoVeiculo() {
        return tipoVeiculo;
    }

    public void setTipoVeiculo(String tipoVeiculo) {
        this.tipoVeiculo = tipoVeiculo;
    }

    public int getCapacidade() {
        return capacidade;
    }

    public void setCapacidade(int capacidade) {
        this.capacidade = capacidade;
    }

    public StatusVeiculo getStatus() {
        return status;
    }

    public void setStatus(StatusVeiculo status) {
        this.status = status;
    }

    public LocalDate getDataAquisicao() {
        return dataAquisicao;
    }

    public void setDataAquisicao(LocalDate dataAquisicao) {
        this.dataAquisicao = dataAquisicao;
    }

    public PropriedadeVeiculo getPropriedade() {
        return propriedade;
    }

    public void setPropriedade(PropriedadeVeiculo propriedade) {
        this.propriedade = propriedade;
    }

    public CategoriaVeiculo getCategoria() {
        return categoria;
    }

    public void setCategoria(CategoriaVeiculo categoria) {
        this.categoria = categoria;
    }

    public BigDecimal getKml() {
        return kml;
    }

    public void setKml(BigDecimal kml) {
        this.kml = kml;
    }

    public LocalDate getUltimaRevisao() {
        return ultimaRevisao;
    }

    public void setUltimaRevisao(LocalDate ultimaRevisao) {
        this.ultimaRevisao = ultimaRevisao;
    }
}
