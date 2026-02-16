import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('RegisterComponent – Integration Test', () => {
  let fixture: ComponentFixture<RegisterComponent>;
  let component: RegisterComponent;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);

    jest.spyOn(window, 'alert').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
    jest.clearAllMocks();
  });

  // ---------------------------------------------------
  // REQUIRED FIELDS
  // ---------------------------------------------------
  it('should show alert if required fields are missing', () => {
    component.register();
    expect(window.alert).toHaveBeenCalledWith('All fields are required');
  });

  // ---------------------------------------------------
  // PASSWORD MISMATCH
  // ---------------------------------------------------
  it('should show alert if passwords do not match', () => {
    component.firstName = 'John';
    component.lastName = 'Doe';
    component.email = 'john@test.com';
    component.password = '123456';
    component.confirmPassword = '654321';

    component.register();

    expect(window.alert).toHaveBeenCalledWith('Passwords do not match');
  });

  // ---------------------------------------------------
  // SUCCESS
  // ---------------------------------------------------
  it('should register user successfully and navigate to login', () => {
    component.firstName = 'John';
    component.lastName = 'Doe';
    component.email = 'john@test.com';
    component.department = 'IDIS';
    component.password = '123456';
    component.confirmPassword = '123456';

    component.register();

    const req = httpMock.expectOne('/api/auth/register');

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@test.com',
      department: 'IDIS',
      password: '123456'
    });

    req.flush({});

    expect(window.alert).toHaveBeenCalledWith('Registration successful');
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  // ---------------------------------------------------
  // FAILURE
  // ---------------------------------------------------
  it('should show error alert if registration fails', () => {
    component.firstName = 'John';
    component.lastName = 'Doe';
    component.email = 'john@test.com';
    component.password = '123456';
    component.confirmPassword = '123456';

    component.register();

    const req = httpMock.expectOne('/api/auth/register');

    req.flush(
      { message: 'Registration failed' },
      { status: 500, statusText: 'Server Error' }
    );

    expect(window.alert).toHaveBeenCalledWith('Registration failed');
  });
});

