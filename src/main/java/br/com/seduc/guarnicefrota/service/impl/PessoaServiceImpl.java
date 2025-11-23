package br.com.seduc.guarnicefrota.service.impl;

import br.com.seduc.guarnicefrota.model.Pessoa;
import br.com.seduc.guarnicefrota.repository.PessoaRepository;
import br.com.seduc.guarnicefrota.service.PessoaService;
//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PessoaServiceImpl implements PessoaService {

    private final PessoaRepository pessoaRepository;
    private final PasswordEncoder passwordEncoder;

    //@Autowired
    public PessoaServiceImpl(PessoaRepository pessoaRepository, PasswordEncoder passwordEncoder) {
        this.pessoaRepository = pessoaRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Pessoa salvarPessoa(Pessoa pessoa) {
        pessoa.setSenha(passwordEncoder.encode(pessoa.getSenha()));
        return pessoaRepository.save(pessoa);
    }

    @Override
    public List<Pessoa> buscarTodosPessoas() {
        return pessoaRepository.findAll();
    }

    @Override
    public Optional<Pessoa> buscarPessoaPorId(Long id) {
        return pessoaRepository.findById(id);
    }

    @Override
    public void deletarPessoa(Long id) {
        pessoaRepository.deleteById(id);
    }

    @Override
    public Optional<Pessoa> buscarPessoaPorEmail(String login) {
        return pessoaRepository.findByEmail(login);
    }
}