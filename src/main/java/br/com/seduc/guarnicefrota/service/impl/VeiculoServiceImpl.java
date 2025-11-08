package br.com.seduc.guarnicefrota.service.impl;

import br.com.seduc.guarnicefrota.model.Veiculo;
import br.com.seduc.guarnicefrota.repository.VeiculoRepository;
import br.com.seduc.guarnicefrota.service.VeiculoService;
//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VeiculoServiceImpl implements VeiculoService {

    private final VeiculoRepository veiculoRepository;

    //@Autowired
    public VeiculoServiceImpl(VeiculoRepository veiculoRepository) {
        this.veiculoRepository = veiculoRepository;
    }

    @Override
    public Veiculo salvarVeiculo(Veiculo veiculo) {
        return veiculoRepository.save(veiculo);
    }

    @Override
    public List<Veiculo> buscarTodosVeiculos() {
        return veiculoRepository.findAll();
    }

    @Override
    public Optional<Veiculo> buscarVeiculoPorId(Long id) {
        return veiculoRepository.findById(id);
    }

    @Override
    public void deletarVeiculo(Long id) {
        veiculoRepository.deleteById(id);
    }
}