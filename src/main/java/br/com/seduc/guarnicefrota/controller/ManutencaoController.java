package br.com.seduc.guarnicefrota.controller;

import br.com.seduc.guarnicefrota.model.Manutencao;
import br.com.seduc.guarnicefrota.model.Veiculo;
import br.com.seduc.guarnicefrota.service.ManutencaoService;
import br.com.seduc.guarnicefrota.service.VeiculoService;
//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/manutencoes")
public class ManutencaoController {

    private final ManutencaoService manutencaoService;
    private final VeiculoService veiculoService;

    //@Autowired
    public ManutencaoController(ManutencaoService manutencaoService, VeiculoService veiculoService) {
        this.manutencaoService = manutencaoService;
        this.veiculoService = veiculoService;
    }

    @PostMapping
    public ResponseEntity<Manutencao> createManutencao(@RequestBody Manutencao manutencao) {
        Manutencao savedManutencao = manutencaoService.salvarManutencao(manutencao);
        return new ResponseEntity<>(savedManutencao, HttpStatus.CREATED);
    }

    @GetMapping
    public List<Manutencao> getAllManutencoes() {
        return manutencaoService.buscarTodasManutencoes();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Manutencao> getManutencaoById(@PathVariable Long id) {
        Optional<Manutencao> manutencao = manutencaoService.buscarManutencaoPorId(id);
        return manutencao.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Manutencao> updateManutencao(@PathVariable Long id, @RequestBody Manutencao manutencaoDetails) {
        Optional<Manutencao> manutencaoOptional = manutencaoService.buscarManutencaoPorId(id);
        if (manutencaoOptional.isPresent()) {
            Manutencao manutencao = manutencaoOptional.get();
            manutencao.setTipo(manutencaoDetails.getTipo());
            manutencao.setDescricao(manutencaoDetails.getDescricao());
            manutencao.setVeiculo(manutencaoDetails.getVeiculo());
            manutencao.setData(manutencaoDetails.getData());
            manutencao.setCusto(manutencaoDetails.getCusto());
            manutencao.setFornecedor(manutencaoDetails.getFornecedor());
            Manutencao updatedManutencao = manutencaoService.salvarManutencao(manutencao);
            return ResponseEntity.ok(updatedManutencao);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteManutencao(@PathVariable Long id) {
        try {
            manutencaoService.deletarManutencao(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/veiculo/{veiculoId}")
    public ResponseEntity<List<Manutencao>> getManutencoesByVeiculo(@PathVariable Long veiculoId) {
        Optional<Veiculo> veiculoOptional = veiculoService.buscarVeiculoPorId(veiculoId);
        if (veiculoOptional.isPresent()) {
            List<Manutencao> manutencoes = manutencaoService.buscarManutencoesPorVeiculo(veiculoOptional.get());
            return ResponseEntity.ok(manutencoes);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}