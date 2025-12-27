package br.com.seduc.guarnicefrota.controller;

import br.com.seduc.guarnicefrota.model.Organograma;
import br.com.seduc.guarnicefrota.service.OrganogramaService;
//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/organograma")
@CrossOrigin(origins = "*") // Permite que o frontend acesse a API
public class OrganogramaController {

    private final OrganogramaService organogramaService;

    //@Autowired
    public OrganogramaController(OrganogramaService organogramaService) {
        this.organogramaService = organogramaService;
    }

    @PostMapping
    public ResponseEntity<Organograma> createOrganograma(@RequestBody Organograma organograma) {
        Organograma savedOrganograma = organogramaService.salvarOrganograma(organograma);
        return new ResponseEntity<>(savedOrganograma, HttpStatus.CREATED);
    }

    @GetMapping
    public List<Organograma> getAllOrganogramas() {
        return organogramaService.buscarTodosOrganogramas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Organograma> getOrganogramaById(@PathVariable Long id) {
        Optional<Organograma> organograma = organogramaService.buscarOrganogramaPorId(id);
        return organograma.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Organograma> updateOrganograma(@PathVariable Long id, @RequestBody Organograma organogramaDetails) {
        Optional<Organograma> organogramaOptional = organogramaService.buscarOrganogramaPorId(id);
        if (organogramaOptional.isPresent()) {
            Organograma organograma = organogramaOptional.get();
            organograma.setNomeSetor(organogramaDetails.getNomeSetor());
            organograma.setResponsavel(organogramaDetails.getResponsavel());
            organograma.setDescricao(organogramaDetails.getDescricao());
            Organograma updatedOrganograma = organogramaService.salvarOrganograma(organograma);
            return ResponseEntity.ok(updatedOrganograma);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteOrganograma(@PathVariable Long id) {
        try {
            organogramaService.deletarOrganograma(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/nome/{nomeSetor}")
    public ResponseEntity<Organograma> getOrganogramaByNomeSetor(@PathVariable String nomeSetor) {
        Optional<Organograma> organograma = organogramaService.buscarPorNomeSetor(nomeSetor);
        return organograma.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}