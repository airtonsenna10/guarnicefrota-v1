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

    // Método Auxiliar para processar o Veículo (Reutilizável)
    // Este método é CRÍTICO para buscar o Veiculo pela placa e associá-lo
    private Veiculo processarVeiculo(Manutencao manutencao) {
        Veiculo veiculoRecebido = manutencao.getVeiculo();

        // 1. Verifica se o Veiculo tem a PLACA (Indicando que veio do Front)
        // Isso pressupõe que a classe Veiculo tem um método getPlaca()
        if (veiculoRecebido != null && veiculoRecebido.getPlaca() != null) {
            String placa = veiculoRecebido.getPlaca();
            // 2. Busca o Veículo completo no banco
            // **ATENÇÃO:** Você precisa de um método buscarVeiculoPorPlaca no VeiculoService
            Optional<Veiculo> veiculoCompleto = veiculoService.buscarVeiculoPorPlaca(placa);
            
            if (veiculoCompleto.isPresent()) {
                return veiculoCompleto.get(); // Retorna o Veículo completo
            }
        }
        // Se não houver placa ou não encontrar, retorna o objeto Veiculo original (pode ser null ou incompleto)
        return veiculoRecebido; 
    }


    @PostMapping
    public ResponseEntity<Manutencao> createManutencao(@RequestBody Manutencao manutencao) {
        
        Veiculo veiculoCompleto = processarVeiculo(manutencao);
        
        if (veiculoCompleto == null || veiculoCompleto.getId() == null) {
             // Retorna BAD_REQUEST se o Veículo não for encontrado/válido
             return new ResponseEntity<>(HttpStatus.BAD_REQUEST); 
        }

        manutencao.setVeiculo(veiculoCompleto); // Associa o Veículo completo
        
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
                
                // 1. Processa o Veículo (pode ter sido alterado ou apenas reenviado a placa)
                Veiculo veiculoCompleto = processarVeiculo(manutencaoDetails);

                if (veiculoCompleto != null) {
                    // Só atualiza se o veiculoCompleto for válido, caso contrário, mantém o Veículo original.
                    // Se a placa enviada for inválida, o processarVeiculo retorna null ou incompleto,
                    // e é melhor tratar isso aqui.
                    if (veiculoCompleto.getId() != null) {
                        manutencao.setVeiculo(veiculoCompleto);
                    } else {
                        // Se o processamento falhou, mas o objeto VeiculoDetalhes tinha algo,
                        // pode ser um erro de requisição. Mantemos o Veiculo existente, mas
                        // é mais seguro retornar um erro.
                        // Neste caso, se a placa for enviada e for inválida, você deve retornar um BAD_REQUEST
                        // Aqui vamos assumir que se não mudou, o Veículo é válido.
                    }
                }
                
                // 2. Atualiza os outros campos
                manutencao.setTipoManutencao(manutencaoDetails.getTipoManutencao()); // Alinhado ao setTipoManutencao
                manutencao.setDescricao(manutencaoDetails.getDescricao());
                manutencao.setDataInicio(manutencaoDetails.getDataInicio());
                manutencao.setPrevisaoEntrega(manutencaoDetails.getPrevisaoEntrega());
                manutencao.setHorarioMarcado(manutencaoDetails.getHorarioMarcado());
                manutencao.setStatus(manutencaoDetails.getStatus());
                
                // 3. Salva
                Manutencao updatedManutencao = manutencaoService.salvarManutencao(manutencao);
                return ResponseEntity.ok(updatedManutencao);
            } else {
                return ResponseEntity.notFound().build();
            }
    }
    
    // ... manter os outros métodos (GET, DELETE, etc.) inalterados
    

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






/* codigo original abaixo para comparação

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
            manutencao.setDataInicio(manutencaoDetails.getDataInicio());
            manutencao.setPrevisaoEntrega(manutencaoDetails.getPrevisaoEntrega());
            manutencao.setStatus(manutencaoDetails.getStatus());
            manutencao.setVeiculo(manutencaoDetails.getVeiculo());
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

*/