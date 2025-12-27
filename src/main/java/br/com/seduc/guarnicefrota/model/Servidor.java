package br.com.seduc.guarnicefrota.model;

import jakarta.persistence.*;

@Entity
@Table(name = "tb03_servidor")
public class Servidor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

     // Relacionamento com Pessoa (tb01_pessoa)
    @ManyToOne(cascade = CascadeType.MERGE) // funciona ao atualizar o servidor com um usuario existente
    @JoinColumn(name = "fk_pessoa", nullable = false)
    private Pessoa pessoa;

    // Relacionamento com Organograma (tb02_organograma)
    @ManyToOne
    @JoinColumn(name = "fk_setor", nullable = false)
    private Organograma setor;

   // @Column(nullable = false)
    //private String nome;

    @Column(nullable = false, unique = true)
    private String matricula;

    @Column(nullable = false)
    private String cargo;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "enum('Ativo','Inativo')")
    private Situacao situacao;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "enum('Servidor','Terceirizado','Estagiario')")
    private Tipo tipo;

    // ENUMS do banco
    public enum Situacao {
        Ativo, Inativo
    }

    public enum Tipo {
        Servidor, Terceirizado, Estagiario
    }

    // Getters and setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Pessoa getPessoa() {
        return pessoa;
    }

    public void setPessoa(Pessoa pessoa) {
        this.pessoa = pessoa;
    }

    public Situacao getSituacao() {
        return situacao;
    }

    public void setSituacao(Situacao situacao) {
        this.situacao = situacao;
    }

    public Tipo getTipo() {
        return tipo;
    }

    public void setTipo(Tipo tipo) {
        this.tipo = tipo;
    }

    

    
}