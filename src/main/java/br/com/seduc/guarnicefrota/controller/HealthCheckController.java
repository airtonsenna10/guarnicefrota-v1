package br.com.seduc.guarnicefrota.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;

@RestController
@RequestMapping("/api/health")
public class HealthCheckController {

    @Autowired
    private DataSource dataSource;

    @GetMapping("/db")
    public ResponseEntity<String> checkDatabaseConnection() {
        try (Connection connection = dataSource.getConnection()) {
            if (connection.isValid(2)) {
                return ResponseEntity.ok("Conexão com o banco de dados OK!");
            } else {
                return ResponseEntity.status(500).body("A conexão com o banco de dados não é válida.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao conectar ao banco de dados: " + e.getMessage());
        }
    }
}

