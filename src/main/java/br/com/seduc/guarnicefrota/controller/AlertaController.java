package br.com.seduc.guarnicefrota.controller;

import br.com.seduc.guarnicefrota.model.Alerta;
import br.com.seduc.guarnicefrota.model.Veiculo;
import br.com.seduc.guarnicefrota.service.AlertaService;
import br.com.seduc.guarnicefrota.service.VeiculoService;
//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/alertas")
public class AlertaController {

    private final AlertaService alertaService;
    private final VeiculoService veiculoService;

    //@Autowired
    public AlertaController(AlertaService alertaService, VeiculoService veiculoService) {
        this.alertaService = alertaService;
        this.veiculoService = veiculoService;
    }

    @PostMapping
    public ResponseEntity<Alerta> createAlerta(@RequestBody Alerta alerta) {
        Alerta savedAlerta = alertaService.salvarAlerta(alerta);
        return new ResponseEntity<>(savedAlerta, HttpStatus.CREATED);
    }

    @GetMapping
    public List<Alerta> getAllAlertas() {
        //return alertaService.buscarTodosAlertas();
        return alertaService.buscarTodosAlertasComVeiculo();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Alerta> getAlertaById(@PathVariable Long id) {
        Optional<Alerta> alerta = alertaService.buscarAlertaPorId(id);
        return alerta.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Alerta> updateAlerta(@PathVariable Long id, @RequestBody Alerta alertaDetails) {
        Optional<Alerta> alertaOptional = alertaService.buscarAlertaPorId(id);
        if (alertaOptional.isPresent()) {
            Alerta alerta = alertaOptional.get();
            alerta.setTipo(alertaDetails.getTipo());
            alerta.setDescricao(alertaDetails.getDescricao());
            alerta.setData(alertaDetails.getData());
            alerta.setVeiculo(alertaDetails.getVeiculo()); // Cuidado ao atualizar relacionamentos assim
            Alerta updatedAlerta = alertaService.salvarAlerta(alerta);
            return ResponseEntity.ok(updatedAlerta);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteAlerta(@PathVariable Long id) {
        try {
            alertaService.deletarAlerta(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/veiculo/{veiculoId}")
    public ResponseEntity<List<Alerta>> getAlertasByVeiculoAssociado(@PathVariable Long veiculoId) {
        Optional<Veiculo> veiculoOptional = veiculoService.buscarVeiculoPorId(veiculoId);
        if (veiculoOptional.isPresent()) {
            List<Alerta> alertas = alertaService.buscarAlertasPorVeiculoAssociado(veiculoOptional.get());
            return ResponseEntity.ok(alertas);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}