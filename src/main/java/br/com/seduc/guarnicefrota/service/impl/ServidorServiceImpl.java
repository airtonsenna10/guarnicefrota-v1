package br.com.seduc.guarnicefrota.service.impl;

import br.com.seduc.guarnicefrota.model.Servidor;
import br.com.seduc.guarnicefrota.repository.ServidorRepository;
import br.com.seduc.guarnicefrota.service.ServidorService;
//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ServidorServiceImpl implements ServidorService {

    private final ServidorRepository servidorRepository;

    //@Autowired
    public ServidorServiceImpl(ServidorRepository servidorRepository) {
        this.servidorRepository = servidorRepository;
    }

    @Override
    public Servidor salvarServidor(Servidor servidor) {
        return servidorRepository.save(servidor);
    }

    @Override
    public List<Servidor> buscarTodosServidores() {
        return servidorRepository.findAll();
    }

    @Override
    public Optional<Servidor> buscarServidorPorId(Long id) {
        return servidorRepository.findById(id);
    }

    @Override
    public void deletarServidor(Long id) {
        servidorRepository.deleteById(id);
    }
}