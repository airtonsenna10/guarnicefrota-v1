package br.com.seduc.guarnicefrota.repository;

import br.com.seduc.guarnicefrota.model.Veiculo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VeiculoRepository extends JpaRepository<Veiculo, Long> {
    // Declaração do método buscarVeiculoPorPlaca
    java.util.Optional<Veiculo> findByPlaca(String placa);

}