package br.com.seduc.guarnicefrota.service;

import br.com.seduc.guarnicefrota.model.Servidor;
import java.util.List;
import java.util.Optional;

public interface ServidorService {

    Servidor salvarServidor(Servidor servidor);

    List<Servidor> buscarTodosServidores();

    Optional<Servidor> buscarServidorPorId(Long id);

    void deletarServidor(Long id);
}