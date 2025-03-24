package com.verified.template.modules.enterprise;

import java.util.List;
import java.util.UUID;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;
import com.vaadin.hilla.Endpoint;

@BrowserCallable
@AnonymousAllowed
@Endpoint
public class EnterpriseEndpoint {
    
    private final EnterpriseService enterpriseService;

    public EnterpriseEndpoint(EnterpriseService enterpriseService) {
        this.enterpriseService = enterpriseService;
    }

    public List<EnterpriseEntity> findAll() {

        List<EnterpriseEntity> s = enterpriseService.findAll();
        return s;
    }

    public String findLogo(UUID id) {

        String img = enterpriseService.findLogo(id);
        return img;
    }
}
