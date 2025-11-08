package br.com.seduc.guarnicefrota.service;

import br.com.seduc.guarnicefrota.model.Organograma;
import java.util.List;
import java.util.Optional;

public interface OrganogramaService {

    Organograma salvarOrganograma(Organograma organograma);

    List<Organograma> buscarTodosOrganogramas();

    Optional<Organograma> buscarOrganogramaPorId(Long id);

    void deletarOrganograma(Long id);

    Optional<Organograma> buscarPorNomeSetor(String nomeSetor);
}