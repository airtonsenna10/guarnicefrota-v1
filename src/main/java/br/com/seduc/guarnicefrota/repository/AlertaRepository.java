package br.com.seduc.guarnicefrota.repository;

import br.com.seduc.guarnicefrota.model.Alerta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import br.com.seduc.guarnicefrota.model.Veiculo;

import java.util.List;

@Repository
public interface AlertaRepository extends JpaRepository<Alerta, Long> {

    // Método para encontrar alertas por veículo
    List<Alerta> findByVeiculo(Veiculo veiculo);

    // Método personalizado para buscar todos os alertas com os dados do veículo carregados
    // Para ser usado com (fetch = FetchType.LAZY) na entidade Alerta
    @Query("SELECT a FROM Alerta a JOIN FETCH a.veiculo")
    List<Alerta> findAllWithVeiculo();
}