package br.com.seduc.guarnicefrota.controller;

import br.com.seduc.guarnicefrota.model.Pessoa;
import br.com.seduc.guarnicefrota.service.PessoaService;
//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/pessoas")
public class PessoaController {

    private final PessoaService pessoaService;

    //@Autowired
    public PessoaController(PessoaService pessoaService) {
        this.pessoaService = pessoaService;
    }

    @PostMapping("/create")
    public ResponseEntity<Pessoa> createPessoa(@RequestBody Pessoa pessoa) {
        Pessoa savedPessoa = pessoaService.salvarPessoa(pessoa);
        return new ResponseEntity<>(savedPessoa, HttpStatus.CREATED);
    }

    @GetMapping
    public List<Pessoa> getAllPessoas() {
        return pessoaService.buscarTodosPessoas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pessoa> getPessoaById(@PathVariable Long id) {
        Optional<Pessoa> pessoa = pessoaService.buscarPessoaPorId(id);
        return pessoa.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pessoa> updatePessoa(@PathVariable Long id, @RequestBody Pessoa pessoaDetails) {
        Optional<Pessoa> pessoaOptional = pessoaService.buscarPessoaPorId(id);
        if (pessoaOptional.isPresent()) {
            Pessoa pessoa = pessoaOptional.get();
            pessoa.setEmail(pessoaDetails.getEmail());
            pessoa.setSenha(pessoaDetails.getSenha()); // Consider hashing password in service
            pessoa.setPapel(pessoaDetails.getPapel());
            Pessoa updatedPessoa = pessoaService.salvarPessoa(pessoa);
            return ResponseEntity.ok(updatedPessoa);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deletePessoa(@PathVariable Long id) {
        try {
            pessoaService.deletarPessoa(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/login/{login}")
    public ResponseEntity<Pessoa> getPessoaByEmail(@PathVariable String Email) {
        Optional<Pessoa> pessoa = pessoaService.buscarPessoaPorEmail(Email);
        return pessoa.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}