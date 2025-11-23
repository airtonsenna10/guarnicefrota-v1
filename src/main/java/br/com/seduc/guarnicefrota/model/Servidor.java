package br.com.seduc.guarnicefrota.model;

import jakarta.persistence.*;

@Entity
@Table(name = "tb03_servidor")
public class Servidor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

     // Relacionamento com Pessoa (tb01_pessoa)
    @ManyToOne
    @JoinColumn(name = "fk_pessoa", nullable = false)
    private Pessoa pessoa;

    // Relacionamento com Organograma (tb02_organograma)
    @ManyToOne
    @JoinColumn(name = "fk_setor", nullable = false)
    private Organograma setor;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String matricula;

    @Column(nullable = false)
    private String cargo;

    @Column(nullable = false)
    private String contato;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "enum('ativo','inativo')")
    private Situacao situacao;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "enum('servidor','terceirizado','estagiario')")
    private Tipo tipo;

    // ENUMS do banco
    public enum Situacao {
        ativo, inativo
    }

    public enum Tipo {
        servidor, terceirizado, estagiario
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

    public String getMatricula() {
        return matricula;
    }

    public void setMatricula(String matricula) {
        this.matricula = matricula;
    }

    public Organograma getSetor() {
        return setor;
    }

    public  void setSetor(Organograma setor) {
        this.setor = setor;
    }

    public String getCargo() {
        return cargo;
    }

    public void setCargo(String cargo) {
        this.cargo = cargo;
    }

    public String getContato() {
        return contato;
    }

    public void setContato(String contato) {
        this.contato = contato;
    }
}