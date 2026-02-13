package com.example.attendance.controller;

import com.example.attendance.entity.Employee;
import com.example.attendance.repository.EmployeeRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(EmployeeController.class)
@Import(com.example.attendance.exception.GlobalExceptionHandler.class)
class EmployeeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EmployeeRepository employeeRepository;

    @Autowired
    private ObjectMapper objectMapper;

    // ===============================
    // GET employee - SUCCESS
    // ===============================
    @Test
    void getEmployeeProfile_shouldReturnEmployee() throws Exception {

        Employee employee = new Employee();
        employee.setId(1L);
        employee.setFirstName("Renu");
        employee.setDepartment("IT");

        when(employeeRepository.findById(1L))
                .thenReturn(Optional.of(employee));

        mockMvc.perform(get("/api/employees/by-id/{id}", 1L))
                .andExpect(status().isOk());

        verify(employeeRepository).findById(1L);
    }

    // ===============================
    // GET employee - NOT FOUND
    // ===============================
    @Test
    void getEmployeeProfile_shouldReturn500_whenEmployeeNotFound() throws Exception {

        when(employeeRepository.findById(1L))
                .thenReturn(Optional.empty());

        mockMvc.perform(get("/api/employees/by-id/{id}", 1L))
                .andExpect(status().isInternalServerError());

        verify(employeeRepository).findById(1L);
    }

    // ===============================
    // UPDATE department - SUCCESS
    // ===============================
    @Test
    void updateDepartment_shouldReturnUpdatedEmployee() throws Exception {

        Employee existing = new Employee();
        existing.setId(1L);
        existing.setDepartment("IT");

        Employee request = new Employee();
        request.setDepartment("HR");

        when(employeeRepository.findById(1L))
                .thenReturn(Optional.of(existing));

        when(employeeRepository.save(any(Employee.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        mockMvc.perform(
                put("/api/employees/{id}/department", 1L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request))
        )
                .andExpect(status().isOk());

        verify(employeeRepository).findById(1L);
        verify(employeeRepository).save(existing);
    }

    // ===============================
    // UPDATE department - NOT FOUND
    // ===============================
    @Test
    void updateDepartment_shouldReturn500_whenEmployeeNotFound() throws Exception {

        Employee request = new Employee();
        request.setDepartment("HR");

        when(employeeRepository.findById(99L))
                .thenReturn(Optional.empty());

        mockMvc.perform(
                put("/api/employees/{id}/department", 99L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request))
        )
                .andExpect(status().isInternalServerError());

        verify(employeeRepository).findById(99L);
        verify(employeeRepository, never()).save(any());
    }
}

