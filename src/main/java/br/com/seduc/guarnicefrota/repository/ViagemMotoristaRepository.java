package br.com.seduc.guarnicefrota.repository;

import br.com.seduc.guarnicefrota.model.ViagemMotorista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ViagemMotoristaRepository extends JpaRepository<ViagemMotorista, Long>{
    
}
