package br.com.seduc.guarnicefrota.service.impl;

import br.com.seduc.guarnicefrota.model.Motorista;
import br.com.seduc.guarnicefrota.repository.MotoristaRepository;
import br.com.seduc.guarnicefrota.service.MotoristaService;
//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MotoristaServiceImpl implements MotoristaService {

    private final MotoristaRepository motoristaRepository;

    //@Autowired
    public MotoristaServiceImpl(MotoristaRepository motoristaRepository) {
        this.motoristaRepository = motoristaRepository;
    }

    @Override
    public Motorista salvarMotorista(Motorista motorista) {
        return motoristaRepository.save(motorista);
    }

    @Override
    public List<Motorista> buscarTodosMotoristas() {
        return motoristaRepository.findAll();
    }

    @Override
    public Optional<Motorista> buscarMotoristaPorId(Long id) {
        return motoristaRepository.findById(id);
    }

    @Override
    public void deletarMotorista(Long id) {
        motoristaRepository.deleteById(id);
    }

    @Override
    public Optional<Motorista> buscarPorCnh(String cnh) {
        return motoristaRepository.findByCnh(cnh);
    }
}