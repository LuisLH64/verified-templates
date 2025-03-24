package com.verified.template.modules.enterprise;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

@Service
public class EnterpriseService {
    
    private final EnterpriseRepository enterpriseRepository;

    public EnterpriseService(EnterpriseRepository enterpriseRepository) {
        this.enterpriseRepository = enterpriseRepository;
    }

    public List<EnterpriseEntity> findAll() {

        List<EnterpriseEntity> s = enterpriseRepository.findAll();
        return s;
    }

    public String findLogo(UUID id) {

        String img = enterpriseRepository.findLogo(id);
        return img;
    }
}
