package br.com.seduc.guarnicefrota.model;

import java.time.LocalDate;

//import br.com.seduc.guarnicefrota.model.Solicitacao.StatusSolicitacao;
import jakarta.persistence.*;


@Entity
@Table(name = "tb11_viagemmotorista")
public class ViagemMotorista {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_viagemmotorista")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "fk_idmotorista", nullable = false)
    private Motorista motorista;

    @ManyToOne
    @JoinColumn(name = "fk_idveiculo", nullable = false)
    private Veiculo veiculo;

    @ManyToOne
    @JoinColumn(name = "fk_idsolicitacao", nullable = false)
    private Solicitacao solicitacao;

    @Column(name = "nome_motorista", length = 100)
    private String nomeMotorista;

    @Column(name = "descricao_veiculo", length = 100)
    private String descricaoVeiculo;

    @Column(name = "placa_veiculo", length = 20)
    private String placaVeiculo;

    @Column(name = "origem", length = 100)
    private String origem;

    @Column(name = "destino", length = 100)
    private String destino;

    @Column(name = "data_inicio")
    private LocalDate dataInicio;

    @Column(name = "data_fim")
    private LocalDate dataFim;

    @Column(name = "observacao", length = 250)
    private String observacao;

    @Column(name = "quantidade_pessoas")
    private Integer quantidadePessoas;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_viagem")
    private StatusViagem status_viagem;

    @Column(name = "justificativa", length = 250)
    private String justificativa;

    // Enum para status
    public enum StatusViagem {
        aprovada,
        cancelada
    }

    // Getters e Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Motorista getMotorista() {
        return motorista;
    }

    public void setMotorista(Motorista motorista) {
        this.motorista = motorista;
    }

    public Veiculo getVeiculo() {
        return veiculo;
    }

    public void setVeiculo(Veiculo veiculo) {
        this.veiculo = veiculo;
    }

    public Solicitacao getSolicitacao() {
        return solicitacao;
    }

    public void setSolicitacao(Solicitacao solicitacao) {
        this.solicitacao = solicitacao;
    }

    public String getNomeMotorista() {
        return nomeMotorista;
    }

    public void setNomeMotorista(String nomeMotorista) {
        this.nomeMotorista = nomeMotorista;
    }

    public String getDescricaoVeiculo() {
        return descricaoVeiculo;
    }

    public void setDescricaoVeiculo(String descricaoVeiculo) {
        this.descricaoVeiculo = descricaoVeiculo;
    }

    public String getPlacaVeiculo() {
        return placaVeiculo;
    }

    public void setPlacaVeiculo(String placaVeiculo) {
        this.placaVeiculo = placaVeiculo;
    }

    public String getOrigem() {
        return origem;
    }

    public void setOrigem(String origem) {
        this.origem = origem;
    }

    public String getDestino() {
        return destino;
    }

    public void setDestino(String destino) {
        this.destino = destino;
    }

    public LocalDate getDataInicio() {
        return dataInicio;
    }

    public void setDataInicio(LocalDate dataInicio) {
        this.dataInicio = dataInicio;
    }

    public LocalDate getDataFim() {
        return dataFim;
    }

    public void setDataFim(LocalDate dataFim) {
        this.dataFim = dataFim;
    }

    public String getObservacao() {
        return observacao;
    }

    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }

    public Integer getQuantidadePessoas() {
        return quantidadePessoas;
    }

    public void setQuantidadePessoas(Integer quantidadePessoas) {
        this.quantidadePessoas = quantidadePessoas;
    }

    public String getJustificativa() {
    return justificativa;
}

    public void setJustificativa(String justificativa) {
        this.justificativa = justificativa;
    }

    public StatusViagem getStatus_viagem() {
        return status_viagem;
    }

    public void setStatus_viagem(StatusViagem status_viagem) {
        this.status_viagem = status_viagem;
    }
    
}

    

