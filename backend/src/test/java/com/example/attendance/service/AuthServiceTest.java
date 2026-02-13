package com.example.attendance.service;

import com.example.attendance.dto.LoginRequest;
import com.example.attendance.dto.RegisterRequest;
import com.example.attendance.entity.Employee;
import com.example.attendance.repository.EmployeeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthServiceTest {

    private EmployeeRepository employeeRepository;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        employeeRepository = Mockito.mock(EmployeeRepository.class);
        authService = new AuthService(employeeRepository);
    }

    // ✅ Test Register Success
    @Test
    void register_ShouldSaveEmployee_WhenEmailNotExists() {

        RegisterRequest request = new RegisterRequest();
        request.setFirstName("Renu");
        request.setLastName("Priyanka");
        request.setEmail("renu@test.com");
        request.setPassword("1234");
        request.setDepartment("IT");

        when(employeeRepository.existsByEmail("renu@test.com"))
                .thenReturn(false);

        when(employeeRepository.save(any(Employee.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Employee savedEmployee = authService.register(request);

        assertEquals("Renu", savedEmployee.getFirstName());
        assertEquals("EMPLOYEE", savedEmployee.getRole());
        verify(employeeRepository, times(1)).save(any(Employee.class));
    }

    // ❌ Test Register Duplicate Email
    @Test
    void register_ShouldThrowException_WhenEmailExists() {

        RegisterRequest request = new RegisterRequest();
        request.setEmail("existing@test.com");

        when(employeeRepository.existsByEmail("existing@test.com"))
                .thenReturn(true);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.register(request);
        });

        assertEquals("Email already registered", exception.getMessage());
    }

    // ✅ Test Login Success
    @Test
    void login_ShouldReturnEmployeeDetails_WhenCredentialsValid() {

        LoginRequest request = new LoginRequest();
        request.setEmail("renu@test.com");
        request.setPassword("1234");

        Employee employee = new Employee();
        employee.setId(1L);
        employee.setEmail("renu@test.com");
        employee.setPassword("1234");
        employee.setFullName("Renu Priyanka");
        employee.setDepartment("IT");
        employee.setRole("EMPLOYEE");

        when(employeeRepository.findByEmail("renu@test.com"))
                .thenReturn(Optional.of(employee));

        var response = authService.login(request);

        assertEquals("renu@test.com", response.get("email"));
        assertEquals("EMPLOYEE", response.get("role"));
    }

    // ❌ Test Login Failure
    @Test
    void login_ShouldThrowException_WhenInvalidCredentials() {

        LoginRequest request = new LoginRequest();
        request.setEmail("wrong@test.com");
        request.setPassword("wrong");

        when(employeeRepository.findByEmail("wrong@test.com"))
                .thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.login(request);
        });

        assertEquals("Invalid credentials", exception.getMessage());
    }
}

