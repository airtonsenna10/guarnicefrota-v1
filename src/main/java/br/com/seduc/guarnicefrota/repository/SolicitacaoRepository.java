package br.com.seduc.guarnicefrota.repository;

import br.com.seduc.guarnicefrota.model.Solicitacao;
import br.com.seduc.guarnicefrota.model.Servidor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {
    List<Solicitacao> findByServidor(Servidor servidor);
    
}