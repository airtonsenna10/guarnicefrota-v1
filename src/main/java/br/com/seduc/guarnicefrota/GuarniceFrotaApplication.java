package br.com.seduc.guarnicefrota;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
public class GuarniceFrotaApplication {

  
  @Value("${NAME:World}")
  String name;
  

 
  @RestController
  class HelloworldController {
    @GetMapping("/hello")
    String hello() {
      return "Hello, conseguindo rodar o Spring Boot - sistema guarnice frota vvvvvvv";
    }
  }

  public static void main(String[] args) {
    SpringApplication.run(GuarniceFrotaApplication.class, args);
  }

}
