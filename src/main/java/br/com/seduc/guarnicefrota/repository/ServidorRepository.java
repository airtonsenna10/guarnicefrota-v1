package br.com.seduc.guarnicefrota.repository;

import br.com.seduc.guarnicefrota.model.Servidor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServidorRepository extends JpaRepository<Servidor, Long> {
}