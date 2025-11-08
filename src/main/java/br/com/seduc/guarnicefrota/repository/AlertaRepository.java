package br.com.seduc.guarnicefrota.repository;

import br.com.seduc.guarnicefrota.model.Alerta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import br.com.seduc.guarnicefrota.model.Veiculo;

import java.util.List;

@Repository
public interface AlertaRepository extends JpaRepository<Alerta, Long> {
    List<Alerta> findByVeiculoAssociado(Veiculo veiculo);
}