package br.com.seduc.guarnicefrota.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "tb12_alerta")
public class Alerta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_alerta;

    @ManyToOne
    @JoinColumn(name = "fk_idveiculo")
    private Veiculo veiculo;

    @Column(nullable = false)
    private String tipo;

    @Column(nullable = false)
    private String descricao;

    @Column(nullable = false)
    private LocalDate data;

    

    // Getters and setters

    public Long getId() {
        return id_alerta;
    }

    public void setId(Long id) {
        this.id_alerta = id;
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

    public LocalDate getData() {
        return data;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }

    public Veiculo getVeiculo() {
        return veiculo;
    }

    public void setVeiculo(Veiculo veiculo) {
        this.veiculo = veiculo;
    }
}