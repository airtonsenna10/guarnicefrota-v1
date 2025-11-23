package br.com.seduc.guarnicefrota.service;

import br.com.seduc.guarnicefrota.model.ViagemMotorista;
import java.util.List;
import java.util.Optional;

public interface ViagemMotoristaService {

    ViagemMotorista salvarViagemMotorista(ViagemMotorista viagemMotorista);

    List<ViagemMotorista> buscarTodasViagens();

    Optional<ViagemMotorista> buscarViagemPorId(Long id);

    void deletarViagem(Long id);
}
