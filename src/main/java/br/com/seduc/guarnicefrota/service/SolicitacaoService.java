package br.com.seduc.guarnicefrota.service;

import br.com.seduc.guarnicefrota.model.Solicitacao;
import br.com.seduc.guarnicefrota.model.Servidor;
import br.com.seduc.guarnicefrota.model.Veiculo;
import java.util.List;
import java.util.Optional;

public interface SolicitacaoService {

    Solicitacao salvarSolicitacao(Solicitacao solicitacao);

    List<Solicitacao> buscarTodasSolicitacoes();

    Optional<Solicitacao> buscarSolicitacaoPorId(Long id);

    void deletarSolicitacao(Long id);

    List<Solicitacao> buscarSolicitacoesPorServidor(Servidor servidor);

    List<Solicitacao> buscarSolicitacoesPorVeiculo(Veiculo veiculo);
}