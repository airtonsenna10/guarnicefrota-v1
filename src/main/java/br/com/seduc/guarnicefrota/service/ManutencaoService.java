package br.com.seduc.guarnicefrota.service;

import br.com.seduc.guarnicefrota.model.Manutencao;
import br.com.seduc.guarnicefrota.model.Veiculo;
import java.util.List;
import java.util.Optional;

public interface ManutencaoService {

    Manutencao salvarManutencao(Manutencao manutencao);

    List<Manutencao> buscarTodasManutencoes();

    Optional<Manutencao> buscarManutencaoPorId(Long id);

    void deletarManutencao(Long id);

    List<Manutencao> buscarManutencoesPorVeiculo(Veiculo veiculo);
}