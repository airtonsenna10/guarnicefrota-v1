package br.com.seduc.guarnicefrota.model;

import jakarta.persistence.*;

@Entity
@Table(name = "tb02_organograma")
public class Organograma {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome_setor", nullable = false, unique = true)
    private String nomeSetor;

    @Column(nullable = false)
    private String responsavel;

    private String descricao;

    // relacionamento recursivo: um item pode ter um pai
    @ManyToOne
    @JoinColumn(name = "pai")
    private Organograma pai;

    // Getters and setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNomeSetor() {
        return nomeSetor;
    }

    public void setNomeSetor(String nomeSetor) {
        this.nomeSetor = nomeSetor;
    }

    public String getResponsavel() {
        return responsavel;
    }

    public void setResponsavel(String responsavel) {
        this.responsavel = responsavel;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
}