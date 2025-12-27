package br.com.seduc.guarnicefrota.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonValue;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "tb07_motorista")
public class Motorista {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_motorista")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "fk_idservidor", nullable = false)
    private Servidor servidor;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String cnh;

    @Column(name = "categoria_cnh")
    private String categoriaCnh;

    @Column(name = "validade_cnh")
    private LocalDate validadeCnh;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private StatusMotorista status;

    @Column(name = "observacao", length = 255)
    private String observacao;


    // Enum compatível com os valores do MySQL: enum('Disponivel','Indisponivel','Em Viagem')
    public enum StatusMotorista {
        Disponivel("Disponivel"),
        Indisponivel("Indisponivel"),
        @JsonProperty("Em Viagem") // Garante que o JSON aceite o espaço
        Em_Viagem("Em Viagem");

        private String value;

        StatusMotorista(String value) {
            this.value = value;
        }

        @JsonValue // Para serializar o valor correto no JSON
        public String getValue() {
            return value;
        }

        @JsonCreator
        public static StatusMotorista forValue(String value) {
            if (value == null) return null;
            for (StatusMotorista status : StatusMotorista.values()) {
                // Compara tanto com o nome da constante quanto com o valor da string
                if (status.value.equalsIgnoreCase(value) || 
                status.name().replace("_", " ").equalsIgnoreCase(value) ||
                status.name().equalsIgnoreCase(value)) {
                return status;
            }
            }
            return null;
        }
    }

    // --- Getters e Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Servidor getServidor() { return servidor; }
    public void setServidor(Servidor servidor) { this.servidor = servidor; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getCnh() { return cnh; }
    public void setCnh(String cnh) { this.cnh = cnh; }

    public String getCategoriaCnh() { return categoriaCnh; }
    public void setCategoriaCnh(String categoriaCnh) { this.categoriaCnh = categoriaCnh; }

    public LocalDate getValidadeCnh() { return validadeCnh; }
    public void setValidadeCnh(LocalDate validadeCnh) { this.validadeCnh = validadeCnh; }

    public StatusMotorista getStatus() { return status; }
    public void setStatus(StatusMotorista status) { this.status = status; }

    public String getObservacao() { return observacao; }
    public void setObservacao(String observacao) { this.observacao = observacao; }

    
       
}