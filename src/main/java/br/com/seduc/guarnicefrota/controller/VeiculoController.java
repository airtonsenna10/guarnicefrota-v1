package br.com.seduc.guarnicefrota.controller;

import br.com.seduc.guarnicefrota.model.Veiculo;
import br.com.seduc.guarnicefrota.service.VeiculoService;
//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/veiculos")
public class VeiculoController {

    private final VeiculoService veiculoService;

    //@Autowired
    public VeiculoController(VeiculoService veiculoService) {
        this.veiculoService = veiculoService;
    }

    @PostMapping
    public ResponseEntity<Veiculo> createVeiculo(@RequestBody Veiculo veiculo) {
        Veiculo savedVeiculo = veiculoService.salvarVeiculo(veiculo);
        return new ResponseEntity<>(savedVeiculo, HttpStatus.CREATED);
    }

    @GetMapping
    public List<Veiculo> getAllVeiculos() {
        return veiculoService.buscarTodosVeiculos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Veiculo> getVeiculoById(@PathVariable Long id) {
        Optional<Veiculo> veiculo = veiculoService.buscarVeiculoPorId(id);
        return veiculo.map(ResponseEntity::ok)
                      .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Veiculo> updateVeiculo(@PathVariable Long id, @RequestBody Veiculo veiculoDetails) {
        return veiculoService.buscarVeiculoPorId(id).map(existingVeiculo -> {
            existingVeiculo.setModelo(veiculoDetails.getModelo());
            existingVeiculo.setMarca(veiculoDetails.getMarca());
            existingVeiculo.setPlaca(veiculoDetails.getPlaca());
            existingVeiculo.setChassi(veiculoDetails.getChassi());
            existingVeiculo.setRenavan(veiculoDetails.getRenavan());
            existingVeiculo.setTipoVeiculo(veiculoDetails.getTipoVeiculo());
            existingVeiculo.setCapacidade(veiculoDetails.getCapacidade());
            existingVeiculo.setStatus(veiculoDetails.getStatus());
            existingVeiculo.setDataAquisicao(veiculoDetails.getDataAquisicao());
            existingVeiculo.setPropriedade(veiculoDetails.getPropriedade());
            existingVeiculo.setCategoria(veiculoDetails.getCategoria());
            existingVeiculo.setKml(veiculoDetails.getKml());
            existingVeiculo.setUltimaRevisao(veiculoDetails.getUltimaRevisao());

            Veiculo updatedVeiculo = veiculoService.salvarVeiculo(existingVeiculo);
            return ResponseEntity.ok(updatedVeiculo);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteVeiculo(@PathVariable Long id) {
        try {
            veiculoService.deletarVeiculo(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
