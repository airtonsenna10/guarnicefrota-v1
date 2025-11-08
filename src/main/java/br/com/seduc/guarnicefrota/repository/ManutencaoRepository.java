package br.com.seduc.guarnicefrota.repository;

import br.com.seduc.guarnicefrota.model.Manutencao;
import br.com.seduc.guarnicefrota.model.Veiculo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ManutencaoRepository extends JpaRepository<Manutencao, Long> {
    List<Manutencao> findByVeiculo(Veiculo veiculo);
}