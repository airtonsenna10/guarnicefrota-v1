package br.com.seduc.guarnicefrota.service;

import br.com.seduc.guarnicefrota.model.Motorista;
import java.util.List;
import java.util.Optional;

public interface MotoristaService {

    Motorista salvarMotorista(Motorista motorista);

    List<Motorista> buscarTodosMotoristas();

    Optional<Motorista> buscarMotoristaPorId(Long id);

    void deletarMotorista(Long id);

    Optional<Motorista> buscarPorCnh(String cnh);
}