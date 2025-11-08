package br.com.seduc.guarnicefrota.repository;

import br.com.seduc.guarnicefrota.model.Motorista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface MotoristaRepository extends JpaRepository<Motorista, Long> {
    Optional<Motorista> findByCnh(String cnh);
}