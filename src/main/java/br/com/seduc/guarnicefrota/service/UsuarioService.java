package br.com.seduc.guarnicefrota.service;

import br.com.seduc.guarnicefrota.model.Usuario;
import java.util.List;
import java.util.Optional;

public interface UsuarioService {

    Usuario salvarUsuario(Usuario usuario);

    List<Usuario> buscarTodosUsuarios();

    Optional<Usuario> buscarUsuarioPorId(Long id);

    Optional<Usuario> buscarUsuarioPorLogin(String login);

    void deletarUsuario(Long id);
}