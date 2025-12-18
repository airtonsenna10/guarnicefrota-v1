package br.com.seduc.guarnicefrota.service.impl;

import br.com.seduc.guarnicefrota.model.Alerta;
import br.com.seduc.guarnicefrota.model.Veiculo;
import br.com.seduc.guarnicefrota.repository.AlertaRepository;
import br.com.seduc.guarnicefrota.service.AlertaService;
//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class AlertaServiceImpl implements AlertaService {

    private final AlertaRepository alertaRepository;

    //@Autowired
    public AlertaServiceImpl(AlertaRepository alertaRepository) {
        this.alertaRepository = alertaRepository;
    }

    @Override
    public Alerta salvarAlerta(Alerta alerta) {
        return alertaRepository.save(alerta);
    }

    @Override
    public List<Alerta> buscarTodosAlertas() {
        // Retorna a lista simples, sem JOIN FETCH (fetch = FetchType.EAGER)
        return alertaRepository.findAll();
    }

    @Override
    public List<Alerta> buscarTodosAlertasComVeiculo() {
        // Retorna a lista com JOIN FETCH para popular a relação Veículo (fetch = FetchType.LAZY)
        return alertaRepository.findAllWithVeiculo();
    }

    @Override
    public Optional<Alerta> buscarAlertaPorId(Long id) {
        return alertaRepository.findById(id);
    }

    @Override
    public void deletarAlerta(Long id) {
        alertaRepository.deleteById(id);
    }

    

    @Override
    public List<Alerta> buscarAlertasPorVeiculoAssociado(Veiculo veiculo) {
        return alertaRepository.findByVeiculo(veiculo);
    }
}