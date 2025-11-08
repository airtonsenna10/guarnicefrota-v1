package br.com.seduc.guarnicefrota.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tb10_tramitacao")
public class Tramitacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tramitacao")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "fk_solicitacao", nullable = false)
    private Solicitacao solicitacao;

    @ManyToOne
    @JoinColumn(name = "fk_organograma", nullable = false)
    private Organograma organograma;

    @Column(name = "data_hora", nullable = false)
    private LocalDateTime dataHora;

    @Enumerated(EnumType.STRING)
    @Column(name = "situacao_status")
    private SituacaoStatus situacaoStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "parecer")
    private Parecer parecer;

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Solicitacao getSolicitacao() {
        return solicitacao;
    }

    public void setSolicitacao(Solicitacao solicitacao) {
        this.solicitacao = solicitacao;
    }

    public Organograma getOrganograma() {
        return organograma;
    }

    public void setOrganograma(Organograma organograma) {
        this.organograma = organograma;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }

    public SituacaoStatus getSituacaoStatus() {
        return situacaoStatus;
    }

    public void setSituacaoStatus(SituacaoStatus situacaoStatus) {
        this.situacaoStatus = situacaoStatus;
    }

    public Parecer getParecer() {
        return parecer;
    }

    public void setParecer(Parecer parecer) {
        this.parecer = parecer;
    }
}
