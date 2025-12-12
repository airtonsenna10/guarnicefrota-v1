package br.com.seduc.guarnicefrota.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "tb08_manutencao")
public class Manutencao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_manutencao", nullable = false)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "fk_idveiculo", nullable = false)
    private Veiculo veiculo;

    @Column(name = "tipo_manutencao", length = 100)
    private String tipo;

    @Column(columnDefinition = "TEXT")
    private String descricao;

   @Column(name = "data_inicio")
    private LocalDate dataInicio;

    @Column(name = "data_fim")
    private LocalDate dataFim;

    @Column(name = "horario_marcado", columnDefinition = "TIME")
    private LocalTime horarioMarcado; // Use LocalTime para mapear TIME

    @Enumerated(EnumType.STRING)
    @Column(name = "status_manutencao")
    private StatusManutencao status;

    public enum StatusManutencao {
        CONCLUIDA,
        NAO_INICIADO,
        EM_ANDAMENTO,
        CANCELADA;
    }

    // Getters and setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Veiculo getVeiculo() {
        return veiculo;
    }

    public void setVeiculo(Veiculo veiculo) {
        this.veiculo = veiculo;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
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

    public LocalTime getHorarioMarcado() {
        return horarioMarcado;
    }

    public void setHorarioMarcado(LocalTime horarioMarcado) {
        this.horarioMarcado = horarioMarcado;
    }

    public StatusManutencao getStatus() {
        return status;
    }

    public void setStatus(StatusManutencao status) {
        this.status = status;
    }
}