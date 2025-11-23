package br.com.seduc.guarnicefrota.service.impl;

import br.com.seduc.guarnicefrota.model.ViagemMotorista;
import br.com.seduc.guarnicefrota.repository.ViagemMotoristaRepository;
import br.com.seduc.guarnicefrota.service.ViagemMotoristaService;
import java.util.*;



public class ViagemMotoristaServiceImpl implements ViagemMotoristaService {

    private final ViagemMotoristaRepository viagemMotoristaRepository;

    public ViagemMotoristaServiceImpl(ViagemMotoristaRepository viagemMotoristaRepository) {
        this.viagemMotoristaRepository = viagemMotoristaRepository;
    }

    @Override
    public ViagemMotorista salvarViagemMotorista(ViagemMotorista viagemMotorista) {
        return viagemMotoristaRepository.save(viagemMotorista);
    }

    @Override
    public List<ViagemMotorista> buscarTodasViagens() {
        return viagemMotoristaRepository.findAll();
    }

    @Override
    public Optional<ViagemMotorista> buscarViagemPorId(Long id) {
        return viagemMotoristaRepository.findById(id);
    }

    @Override
    public void deletarViagem(Long id) {
        viagemMotoristaRepository.deleteById(id);
    }
    
}
