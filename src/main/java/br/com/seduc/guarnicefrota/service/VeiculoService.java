package br.com.seduc.guarnicefrota.service;

import br.com.seduc.guarnicefrota.model.Veiculo;
import java.util.List;
import java.util.Optional;

public interface VeiculoService {

    Veiculo salvarVeiculo(Veiculo veiculo);

    List<Veiculo> buscarTodosVeiculos();

    Optional<Veiculo> buscarVeiculoPorId(Long id);

    void deletarVeiculo(Long id);

}