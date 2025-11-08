package br.com.seduc.guarnicefrota.controller;

import br.com.seduc.guarnicefrota.model.Servidor;
import br.com.seduc.guarnicefrota.service.ServidorService;
//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/servidores")
public class ServidorController {

    private final ServidorService servidorService;

    //@Autowired
    public ServidorController(ServidorService servidorService) {
        this.servidorService = servidorService;
    }

    @PostMapping
    public ResponseEntity<Servidor> createServidor(@RequestBody Servidor servidor) {
        Servidor savedServidor = servidorService.salvarServidor(servidor);
        return new ResponseEntity<>(savedServidor, HttpStatus.CREATED);
    }

    @GetMapping
    public List<Servidor> getAllServidores() {
        return servidorService.buscarTodosServidores();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Servidor> getServidorById(@PathVariable Long id) {
        Optional<Servidor> servidor = servidorService.buscarServidorPorId(id);
        return servidor.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Servidor> updateServidor(@PathVariable Long id, @RequestBody Servidor servidorDetails) {
        Optional<Servidor> servidorOptional = servidorService.buscarServidorPorId(id);
        if (servidorOptional.isPresent()) {
            Servidor servidor = servidorOptional.get();
            servidor.setNome(servidorDetails.getNome());
            servidor.setMatricula(servidorDetails.getMatricula());
            servidor.setSetor(servidorDetails.getSetor());
            servidor.setCargo(servidorDetails.getCargo());
            servidor.setContato(servidorDetails.getContato());
            Servidor updatedServidor = servidorService.salvarServidor(servidor);
            return ResponseEntity.ok(updatedServidor);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteServidor(@PathVariable Long id) {
        try {
            servidorService.deletarServidor(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}