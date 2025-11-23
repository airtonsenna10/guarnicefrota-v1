package br.com.seduc.guarnicefrota.service.impl;

import br.com.seduc.guarnicefrota.model.Solicitacao;
import br.com.seduc.guarnicefrota.model.Servidor;
import br.com.seduc.guarnicefrota.repository.SolicitacaoRepository;
import br.com.seduc.guarnicefrota.service.SolicitacaoService;
//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class SolicitacaoServiceImpl implements SolicitacaoService {

    private final SolicitacaoRepository solicitacaoRepository;

    //@Autowired
    public SolicitacaoServiceImpl(SolicitacaoRepository solicitacaoRepository) {
        this.solicitacaoRepository = solicitacaoRepository;
    }

    @Override
    public Solicitacao salvarSolicitacao(Solicitacao solicitacao) {
        return solicitacaoRepository.save(solicitacao);
    }

    @Override
    public List<Solicitacao> buscarTodasSolicitacoes() {
        return solicitacaoRepository.findAll();
    }

    @Override
    public Optional<Solicitacao> buscarSolicitacaoPorId(Long id) {
        return solicitacaoRepository.findById(id);
    }

    @Override
    public void deletarSolicitacao(Long id) {
        solicitacaoRepository.deleteById(id);
    }

    @Override
    public List<Solicitacao> buscarSolicitacoesPorServidor(Servidor servidor) {
        return solicitacaoRepository.findByServidor(servidor);
    }

    
}