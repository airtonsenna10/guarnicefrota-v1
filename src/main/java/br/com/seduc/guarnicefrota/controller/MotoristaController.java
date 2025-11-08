package br.com.seduc.guarnicefrota.controller;

import br.com.seduc.guarnicefrota.model.Motorista;
import br.com.seduc.guarnicefrota.service.MotoristaService;
//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/motoristas")
public class MotoristaController {

    private final MotoristaService motoristaService;

    //@Autowired
    public MotoristaController(MotoristaService motoristaService) {
        this.motoristaService = motoristaService;
    }

    @PostMapping
    public ResponseEntity<Motorista> createMotorista(@RequestBody Motorista motorista) {
        Motorista savedMotorista = motoristaService.salvarMotorista(motorista);
        return new ResponseEntity<>(savedMotorista, HttpStatus.CREATED);
    }

    @GetMapping
    public List<Motorista> getAllMotoristas() {
        return motoristaService.buscarTodosMotoristas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Motorista> getMotoristaById(@PathVariable Long id) {
        Optional<Motorista> motorista = motoristaService.buscarMotoristaPorId(id);
        return motorista.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Motorista> updateMotorista(@PathVariable Long id, @RequestBody Motorista motoristaDetails) {
        Optional<Motorista> motoristaOptional = motoristaService.buscarMotoristaPorId(id);
        if (motoristaOptional.isPresent()) {
            Motorista motorista = motoristaOptional.get();
            motorista.setNome(motoristaDetails.getNome());
            motorista.setCnh(motoristaDetails.getCnh());
            motorista.setCategoriaCnh(motoristaDetails.getCategoriaCnh());
            motorista.setValidadeCnh(motoristaDetails.getValidadeCnh());
            motorista.setDisponibilidade(motoristaDetails.isDisponibilidade());
            Motorista updatedMotorista = motoristaService.salvarMotorista(motorista);
            return ResponseEntity.ok(updatedMotorista);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteMotorista(@PathVariable Long id) {
        try {
            motoristaService.deletarMotorista(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/cnh/{cnh}")
    public ResponseEntity<Motorista> getMotoristaByCnh(@PathVariable String cnh) {
        Optional<Motorista> motorista = motoristaService.buscarPorCnh(cnh);
        return motorista.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}