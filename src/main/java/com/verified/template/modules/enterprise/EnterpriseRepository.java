package com.verified.template.modules.enterprise;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface EnterpriseRepository extends JpaRepository<EnterpriseEntity, UUID> {
    
    @Query(value = "SELECT logo FROM enterprise WHERE id = :id", nativeQuery = true)
    String findLogo(UUID id);
}
