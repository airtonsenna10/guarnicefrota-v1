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
       // 1. Verifica se a senha não é nula e nem está vazia
    if (pessoa.getSenha() != null && !pessoa.getSenha().trim().isEmpty()) {
        
        // 2. Só criptografa se for uma senha "crua" (texto puro).
        // Hashes do BCrypt geralmente começam com '$2a$' e têm 60 caracteres.
        if (!pessoa.getSenha().startsWith("$2a$")) {
            pessoa.setSenha(passwordEncoder.encode(pessoa.getSenha()));
        }
    } else {
        // 3. Se a senha for nula/vazia (caso de edição sem troca de senha),
        // precisamos garantir que o JPA não tente salvar um valor nulo.
        // Se for uma atualização, buscamos a senha atual do banco.
        if (pessoa.getId() != null) {
            pessoaRepository.findById(pessoa.getId()).ifPresent(p -> {
                pessoa.setSenha(p.getSenha());
            });
        }
    }
    
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