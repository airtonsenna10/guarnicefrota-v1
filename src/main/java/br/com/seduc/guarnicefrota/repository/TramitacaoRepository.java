package br.com.seduc.guarnicefrota.repository;

import br.com.seduc.guarnicefrota.model.Tramitacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TramitacaoRepository extends JpaRepository<Tramitacao, Long>{
    
}
