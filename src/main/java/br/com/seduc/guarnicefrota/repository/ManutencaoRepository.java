package br.com.seduc.guarnicefrota.repository;

import br.com.seduc.guarnicefrota.model.Manutencao;
import br.com.seduc.guarnicefrota.model.Veiculo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ManutencaoRepository extends JpaRepository<Manutencao, Long> {
    @Query("SELECT m FROM Manutencao m JOIN FETCH m.veiculo")
    List<Manutencao> findAllWithVeiculo();

    // O método findByVeiculo agora pode ser simplificado (Spring Data JPA já o cria) 
    // ou mantido se você precisar do JOIN FETCH para filtragem:
    List<Manutencao> findByVeiculo(Veiculo veiculo);
    
    // Se quiser o JOIN FETCH para a listagem por veículo (opcional, mas recomendado):
    // @Query("SELECT m FROM Manutencao m JOIN FETCH m.veiculo WHERE m.veiculo = :veiculo")
    // List<Manutencao> findByVeiculoWithFetch(@Param("veiculo") Veiculo veiculo);


}