package br.com.seduc.guarnicefrota.repository;

import br.com.seduc.guarnicefrota.model.Pessoa;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PessoaRepository extends JpaRepository<Pessoa, Long> {
    Optional<Pessoa> findByEmail(String Email);
}