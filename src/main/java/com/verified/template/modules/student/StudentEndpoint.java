package com.verified.template.modules.student;

import java.util.List;

import com.vaadin.hilla.Endpoint;

import jakarta.annotation.security.DenyAll;

@Endpoint
@DenyAll
public class StudentEndpoint {
    
    public List<Student> findAll(){
        return null;
    }
}
