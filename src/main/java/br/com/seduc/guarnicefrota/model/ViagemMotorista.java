package br.com.seduc.guarnicefrota.model;

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

    // Getters and Setters
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
    
}
