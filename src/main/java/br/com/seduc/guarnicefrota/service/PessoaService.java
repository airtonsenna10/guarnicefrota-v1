package br.com.seduc.guarnicefrota.service;

import br.com.seduc.guarnicefrota.model.Pessoa;
import java.util.List;
import java.util.Optional;

public interface PessoaService {

    Pessoa salvarPessoa(Pessoa pessoa);

    List<Pessoa> buscarTodosPessoas();

    Optional<Pessoa> buscarPessoaPorId(Long id);

    Optional<Pessoa> buscarPessoaPorEmail(String Email);

    void deletarPessoa(Long id);
}