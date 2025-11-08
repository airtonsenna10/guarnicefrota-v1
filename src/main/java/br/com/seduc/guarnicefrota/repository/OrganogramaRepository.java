package br.com.seduc.guarnicefrota.repository;

import br.com.seduc.guarnicefrota.model.Organograma;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface OrganogramaRepository extends JpaRepository<Organograma, Long> {
    Optional<Organograma> findByNomeSetor(String nomeSetor);
}