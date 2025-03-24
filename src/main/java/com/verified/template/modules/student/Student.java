package com.verified.template.modules.student;

import java.time.LocalDate;

import lombok.Data;

@Data
public class Student {

    private String name; 
    private String grade;
    private String inscriptionName;
    private LocalDate date;
}
