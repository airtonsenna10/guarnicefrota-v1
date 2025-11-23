package br.com.seduc.guarnicefrota.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "tb09_solicitacao")
public class Solicitacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_solicitacao")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "fk_idservidor", nullable = false)
    private Servidor servidor;

    @Column(name = "data_solicitacao", nullable = false)
    private LocalDateTime dataSolicitacao;

    @Column(name = "origem", length = 100)
    private String origem;

    @Column(name = "destino", length = 100)
    private String destino;

    @Column(name = "data_inicio")
    private LocalDate dataInicio;

    @Column(name = "data_fim")
    private LocalDate dataFim;

    @Column(name = "horario_saida")
    private LocalTime horario_saida;

    @Column(name = "horario_chegada")
    private LocalTime horario_chegada;

    @Column(name = "justificativa", length = 250)
    private String justificativa;

    @Column(name = "quant_pessoas")
    private Integer quantPessoas;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_solicitação")
    private StatusSolicitacao status;

    @Column(name = "bagagem_litros", length = 100)
    private String bagagemLitros;

    public enum StatusSolicitacao {
        pendente,
        aprovada,
        negada
    }

    // Getters and setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Servidor getServidor() {
        return servidor;
    }

    public void setServidor(Servidor servidor) {
        this.servidor = servidor;
    }

    public LocalDateTime getDataSolicitacao() {
        return dataSolicitacao;
    }

    public void setDataSolicitacao(LocalDateTime dataSolicitacao) {
        this.dataSolicitacao = dataSolicitacao;
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

    public LocalTime getHorarioSaida() {
        return horario_saida;
    }

    public void setHorarioSaida(LocalTime horario_saida) {
        this.horario_saida = horario_saida;
    }

    public LocalTime getHorarioChegada() {
        return horario_chegada;
    }

    public void setHorarioChegada(LocalTime horario_chegada) {
        this.horario_chegada = horario_chegada;
    }
    public String getJustificativa() {
        return justificativa;
    }

    public void setJustificativa(String justificativa) {
        this.justificativa = justificativa;
    }

    public Integer getQuantPessoas() {
        return quantPessoas;
    }

    public void setQuantPessoas(Integer quantPessoas) {
        this.quantPessoas = quantPessoas;
    }

    public StatusSolicitacao getStatus() {
        return status;
    }

    public void setStatus(StatusSolicitacao status) {
        this.status = status;
    }

    public String getBagagemLitros() {
        return bagagemLitros;
    }

    public void setBagagemLitros(String bagagemLitros) {
        this.bagagemLitros = bagagemLitros;
    }

}