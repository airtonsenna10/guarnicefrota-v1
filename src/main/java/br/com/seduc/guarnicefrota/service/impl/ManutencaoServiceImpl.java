package br.com.seduc.guarnicefrota.service.impl;

import br.com.seduc.guarnicefrota.model.Manutencao;
import br.com.seduc.guarnicefrota.model.Veiculo;
import br.com.seduc.guarnicefrota.repository.ManutencaoRepository;
import br.com.seduc.guarnicefrota.service.ManutencaoService;
//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ManutencaoServiceImpl implements ManutencaoService {

    private final ManutencaoRepository manutencaoRepository;

    //@Autowired
    public ManutencaoServiceImpl(ManutencaoRepository manutencaoRepository) {
        this.manutencaoRepository = manutencaoRepository;
    }

    @Override
    public Manutencao salvarManutencao(Manutencao manutencao) {
        return manutencaoRepository.save(manutencao);
    }

    @Override
    public List<Manutencao> buscarTodasManutencoes() {
        return manutencaoRepository.findAll();
    }

    @Override
    public Optional<Manutencao> buscarManutencaoPorId(Long id) {
        return manutencaoRepository.findById(id);
    }

    @Override
    public void deletarManutencao(Long id) {
        manutencaoRepository.deleteById(id);
    }

    @Override
    public List<Manutencao> buscarManutencoesPorVeiculo(Veiculo veiculo) {
        return manutencaoRepository.findByVeiculo(veiculo);
    }
}