package br.com.seduc.guarnicefrota.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

//import com.fasterxml.jackson.annotation.JsonBackReference;

//import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "tb08_manutencao")
public class Manutencao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_manutencao", nullable = false)
    private Long id;

    @ManyToOne (fetch = FetchType.EAGER)
    @JoinColumn(name = "fk_idveiculo", nullable = false)
    //@JsonManagedReference
    private Veiculo veiculo;

    @Column(name = "tipo_manutencao", length = 100)
    private String tipoManutencao;

    @Column(columnDefinition = "TEXT")
    private String descricao;

   @Column(name = "data_inicio")
    private LocalDate dataInicio;

    @Column(name = "previsao_entrega")
    private LocalDate previsaoEntrega;

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

    public String getTipoManutencao() {
        return tipoManutencao;
    }

    public void setTipoManutencao(String tipoManutencao) {
        this.tipoManutencao = tipoManutencao;
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

    public LocalDate getPrevisaoEntrega() {
        return previsaoEntrega;
    }

    public void setPrevisaoEntrega(LocalDate previsaoEntrega) {
        this.previsaoEntrega = previsaoEntrega;
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