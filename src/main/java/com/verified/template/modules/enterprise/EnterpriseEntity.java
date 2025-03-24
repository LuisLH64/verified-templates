package com.verified.template.modules.enterprise;

import java.io.Serializable;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "enterprise", schema = "responses")
@Data
public class EnterpriseEntity implements Serializable {
    
    public EnterpriseEntity() {}

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private UUID id;

    @Column(name = "name")
    private String name;

    @Column(name = "business_name")
    private String businessName;

    @Column(name = "logo")
    private String logo;

    @Column(name = "cnpj")
    private String cnpj;
}
