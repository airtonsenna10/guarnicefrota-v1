package br.com.seduc.guarnicefrota.service.impl;

import br.com.seduc.guarnicefrota.model.Organograma;
import br.com.seduc.guarnicefrota.repository.OrganogramaRepository;
import br.com.seduc.guarnicefrota.service.OrganogramaService;
//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrganogramaServiceImpl implements OrganogramaService {

    private final OrganogramaRepository organogramaRepository;

    //@Autowired
    public OrganogramaServiceImpl(OrganogramaRepository organogramaRepository) {
        this.organogramaRepository = organogramaRepository;
    }

    @Override
    public Organograma salvarOrganograma(Organograma organograma) {
        return organogramaRepository.save(organograma);
    }

    @Override
    public List<Organograma> buscarTodosOrganogramas() {
        return organogramaRepository.findAll();
    }

    @Override
    public Optional<Organograma> buscarOrganogramaPorId(Long id) {
        return organogramaRepository.findById(id);
    }

    @Override
    public void deletarOrganograma(Long id) {
        organogramaRepository.deleteById(id);
    }

    @Override
    public Optional<Organograma> buscarPorNomeSetor(String nomeSetor) {
        return organogramaRepository.findByNomeSetor(nomeSetor);
    }
}