package br.com.seduc.guarnicefrota.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "tb07_motorista")
public class Motorista {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_motorista")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "fk_idservidor", nullable = false)
    private Servidor idServidor;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String cnh;

    @Column(name = "categoria_cnh", nullable = false)
    private String categoriaCnh;

    @Column(name = "validade_cnh", nullable = false)
    private LocalDate validadeCnh;

    @Enumerated(EnumType.STRING)
    @Column(name = "ativo", nullable = false)
    private Disponibilidade ativo;

    @Column(name = "observação", length = 250)
    private String observacao;

    public enum Disponibilidade {
        disponível,
        não_disponível
    }

    // Getters and setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCnh() {
        return cnh;
    }

    public void setCnh(String cnh) {
        this.cnh = cnh;
    }

    public String getCategoriaCnh() {
        return categoriaCnh;
    }

    public void setCategoriaCnh(String categoriaCnh) {
        this.categoriaCnh = categoriaCnh;
    }

    public LocalDate getValidadeCnh() {
        return validadeCnh;
    }

    public void setValidadeCnh(LocalDate validadeCnh) {
        this.validadeCnh = validadeCnh;
    }

    public Disponibilidade getAtivo() {
        return ativo;
    }

    public void setAtivo(Disponibilidade ativo) {
        this.ativo = ativo;
    }

    public String getObservacao() {
        return observacao;
    }

    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }

    
}