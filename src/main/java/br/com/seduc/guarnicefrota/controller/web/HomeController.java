package br.com.seduc.guarnicefrota.controller.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "index"; // This will resolve to src/main/resources/templates/index.html
    }

    @GetMapping("/veiculos")
    public String veiculos() {
        return "veiculos"; // This will resolve to src/main/resources/templates/veiculos.html
    }

    @GetMapping("/manutencoes")
    public String manutencoes() {
        return "manutencoes"; // This will resolve to src/main/resources/templates/manutencoes.html
    }

    @GetMapping("/solicitacoes")
    public String solicitacoes() {
        return "solicitacoes"; // This will resolve to src/main/resources/templates/solicitacoes.html
    }
}