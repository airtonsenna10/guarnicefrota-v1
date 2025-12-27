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
@RequestMapping("/api/servidor")
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

   
    

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteServidor(@PathVariable Long id) {
        try {
            servidorService.deletarServidor(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    @PutMapping("/{id}")
        public ResponseEntity<Servidor> updateServidor(@PathVariable Long id, @RequestBody Servidor servidorDetails) {
        return servidorService.buscarServidorPorId(id).map(servidor -> {
            // 1. Atualiza campos básicos do Servidor
            servidor.setMatricula(servidorDetails.getMatricula());
            servidor.setCargo(servidorDetails.getCargo());
            servidor.setTipo(servidorDetails.getTipo());
            servidor.setSituacao(servidorDetails.getSituacao());
            
            // 2. Atualiza os vínculos de objetos
            servidor.setSetor(servidorDetails.getSetor());
            
            // 3. Atualiza a Pessoa (Se o nome mudou na tela, atualiza na tb01_pessoa)
            if (servidorDetails.getPessoa() != null) {
                // Se for a mesma pessoa, apenas atualizamos o nome no objeto persistido
                if (servidor.getPessoa().getId().equals(servidorDetails.getPessoa().getId())) {
                    servidor.getPessoa().setNome(servidorDetails.getPessoa().getNome());
                } else {
                    // Se mudou a pessoa vinculada ao servidor
                    servidor.setPessoa(servidorDetails.getPessoa());
                }
            }

            Servidor updatedServidor = servidorService.salvarServidor(servidor);
            return ResponseEntity.ok(updatedServidor);
        }).orElse(ResponseEntity.notFound().build());
    }


}









/* 

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
@RequestMapping("/api/servidor")
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

    /*
    @PutMapping("/{id}")
    public ResponseEntity<Servidor> updateServidor(@PathVariable Long id, @RequestBody Servidor servidorDetails) {
        Optional<Servidor> servidorOptional = servidorService.buscarServidorPorId(id);
        if (servidorOptional.isPresent()) {
            Servidor servidor = servidorOptional.get();
            //servidor.setNome(servidorDetails.getPessoa().getNome());
            servidor.setMatricula(servidorDetails.getMatricula());
            servidor.setSetor(servidorDetails.getSetor());
            servidor.setCargo(servidorDetails.getCargo());
            servidor.setPessoa(servidorDetails.getPessoa());
            servidor.setTipo(servidorDetails.getTipo());
            servidor.setSituacao(servidorDetails.getSituacao());
            Servidor updatedServidor = servidorService.salvarServidor(servidor);
            return ResponseEntity.ok(updatedServidor);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    */

    /* 

        @PutMapping("/{id}")
        public ResponseEntity<Servidor> updateServidor(@PathVariable Long id, @RequestBody Servidor servidorDetails) {
        Optional<Servidor> servidorOptional = servidorService.buscarServidorPorId(id);
        
        if (servidorOptional.isPresent()) {
            Servidor servidor = servidorOptional.get();
            
            // Se você quiser atualizar o nome da pessoa vinculada ao servidor:
            if (servidor.getPessoa() != null && servidorDetails.getPessoa() != null) {
                servidor.getPessoa().setNome(servidorDetails.getPessoa().getNome());
                // Se o email e celular também puderem ser editados aqui:
                servidor.getPessoa().setEmail(servidorDetails.getPessoa().getEmail());
                servidor.getPessoa().setCelular(servidorDetails.getPessoa().getCelular());
            }

            servidor.setMatricula(servidorDetails.getMatricula());
            servidor.setSetor(servidorDetails.getSetor());
            servidor.setCargo(servidorDetails.getCargo());
            servidor.setTipo(servidorDetails.getTipo());
            servidor.setSituacao(servidorDetails.getSituacao());

            // Importante: Se o servidorDetails trouxer uma nova Pessoa (troca de vínculo)
            // servidor.setPessoa(servidorDetails.getPessoa()); 

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



    @PutMapping("/{id}")
public ResponseEntity<Servidor> updateServidor(@PathVariable Long id, @RequestBody Servidor servidorDetails) {
    return servidorService.buscarServidorPorId(id).map(servidor -> {
        // 1. Atualiza campos básicos do Servidor
        servidor.setMatricula(servidorDetails.getMatricula());
        servidor.setCargo(servidorDetails.getCargo());
        servidor.setTipo(servidorDetails.getTipo());
        servidor.setSituacao(servidorDetails.getSituacao());
        
        // 2. Atualiza os vínculos de objetos
        servidor.setSetor(servidorDetails.getSetor());
        
        // 3. Atualiza a Pessoa (Se o nome mudou na tela, atualiza na tb01_pessoa)
        if (servidorDetails.getPessoa() != null) {
            // Se for a mesma pessoa, apenas atualizamos o nome no objeto persistido
            if (servidor.getPessoa().getId().equals(servidorDetails.getPessoa().getId())) {
                servidor.getPessoa().setNome(servidorDetails.getPessoa().getNome());
            } else {
                // Se mudou a pessoa vinculada ao servidor
                servidor.setPessoa(servidorDetails.getPessoa());
            }
        }

        Servidor updatedServidor = servidorService.salvarServidor(servidor);
        return ResponseEntity.ok(updatedServidor);
    }).orElse(ResponseEntity.notFound().build());
}


}

*/