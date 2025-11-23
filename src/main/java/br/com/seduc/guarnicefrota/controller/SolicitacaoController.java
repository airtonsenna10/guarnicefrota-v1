package br.com.seduc.guarnicefrota.controller;

import br.com.seduc.guarnicefrota.model.Solicitacao;
import br.com.seduc.guarnicefrota.model.Servidor;
import br.com.seduc.guarnicefrota.service.SolicitacaoService;
import br.com.seduc.guarnicefrota.service.ServidorService;
import br.com.seduc.guarnicefrota.service.VeiculoService;
//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/solicitacoes")
public class SolicitacaoController {

    private final SolicitacaoService solicitacaoService;
    private final ServidorService servidorService;
    

    //@Autowired
    public SolicitacaoController(SolicitacaoService solicitacaoService, ServidorService servidorService, VeiculoService veiculoService) {
        this.solicitacaoService = solicitacaoService;
        this.servidorService = servidorService;
        
    }

    @PostMapping
    public ResponseEntity<Solicitacao> createSolicitacao(@RequestBody Solicitacao solicitacao) {
        // In a real application, you would likely set the initial status here
        // solicitacao.setStatus("PENDENTE");
        Solicitacao savedSolicitacao = solicitacaoService.salvarSolicitacao(solicitacao);
        return new ResponseEntity<>(savedSolicitacao, HttpStatus.CREATED);
    }

    @GetMapping
    public List<Solicitacao> getAllSolicitacoes() {
        return solicitacaoService.buscarTodasSolicitacoes();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Solicitacao> getSolicitacaoById(@PathVariable Long id) {
        Optional<Solicitacao> solicitacao = solicitacaoService.buscarSolicitacaoPorId(id);
        return solicitacao.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Solicitacao> updateSolicitacao(@PathVariable Long id, @RequestBody Solicitacao solicitacaoDetails) {
        Optional<Solicitacao> solicitacaoOptional = solicitacaoService.buscarSolicitacaoPorId(id);
        if (solicitacaoOptional.isPresent()) {
            Solicitacao solicitacao = solicitacaoOptional.get();
            solicitacao.setServidor(solicitacaoDetails.getServidor()); // Cuidado ao atualizar relacionamentos assim
            solicitacao.setDataSolicitacao(solicitacaoDetails.getDataSolicitacao());
            solicitacao.setOrigem(solicitacaoDetails.getOrigem());
            solicitacao.setDestino(solicitacaoDetails.getDestino());
            solicitacao.setDataInicio(solicitacaoDetails.getDataInicio());
            solicitacao.setDataFim(solicitacaoDetails.getDataFim());
            solicitacao.setHorarioSaida(solicitacaoDetails.getHorarioSaida());
            solicitacao.setHorarioChegada(solicitacaoDetails.getHorarioChegada());
            solicitacao.setJustificativa(solicitacaoDetails.getJustificativa());
            solicitacao.setQuantPessoas(solicitacaoDetails.getQuantPessoas());
            solicitacao.setStatus(solicitacaoDetails.getStatus());
            solicitacao.setBagagemLitros(solicitacaoDetails.getBagagemLitros());
            
            Solicitacao updatedSolicitacao = solicitacaoService.salvarSolicitacao(solicitacao);
            return ResponseEntity.ok(updatedSolicitacao);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteSolicitacao(@PathVariable Long id) {
        try {
            solicitacaoService.deletarSolicitacao(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/servidor/{servidorId}")
    public ResponseEntity<List<Solicitacao>> getSolicitacoesByServidor(@PathVariable Long servidorId) {
        Optional<Servidor> servidorOptional = servidorService.buscarServidorPorId(servidorId);
        if (servidorOptional.isPresent()) {
            List<Solicitacao> solicitacoes = solicitacaoService.buscarSolicitacoesPorServidor(servidorOptional.get());
            return ResponseEntity.ok(solicitacoes);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    
}