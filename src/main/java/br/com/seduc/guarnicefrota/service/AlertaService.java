package br.com.seduc.guarnicefrota.service;

import br.com.seduc.guarnicefrota.model.Alerta;
import br.com.seduc.guarnicefrota.model.Veiculo;
import java.util.List;
import java.util.Optional;

public interface AlertaService {

    Alerta salvarAlerta(Alerta alerta);

    List<Alerta> buscarTodosAlertas();

    Optional<Alerta> buscarAlertaPorId(Long id);

    void deletarAlerta(Long id);

    List<Alerta> buscarAlertasPorVeiculoAssociado(Veiculo veiculo);
}