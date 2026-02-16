import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('LoginComponent – Integration Test', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
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
    localStorage.clear();
  });

  // ---------------------------------------------------
  // SUCCESS – EMPLOYEE
  // ---------------------------------------------------
  it('should login employee and navigate to employee dashboard', () => {
    component.email = 'emp@test.com';
    component.password = '123456';

    component.login();

    const req = httpMock.expectOne('/api/auth/login');

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      email: 'emp@test.com',
      password: '123456'
    });

    req.flush({
      role: 'EMPLOYEE',
      email: 'emp@test.com'
    });

    expect(localStorage.getItem('loggedInUser')).toContain('EMPLOYEE');
    expect(router.navigate).toHaveBeenCalledWith(['/employee-dashboard']);
  });

  // ---------------------------------------------------
  // SUCCESS – ADMIN
  // ---------------------------------------------------
  it('should login admin and navigate to admin dashboard', () => {
    component.email = 'admin@test.com';
    component.password = 'admin123';

    component.login();

    const req = httpMock.expectOne('/api/auth/login');

    req.flush({
      role: 'ADMIN',
      email: 'admin@test.com'
    });

    expect(router.navigate).toHaveBeenCalledWith(['/admin-dashboard']);
  });

  // ---------------------------------------------------
  // UNKNOWN ROLE
  // ---------------------------------------------------
  it('should show alert for unknown role', () => {
    component.email = 'user@test.com';
    component.password = '123';

    component.login();

    const req = httpMock.expectOne('/api/auth/login');

    req.flush({
      role: 'MANAGER'
    });

    expect(window.alert).toHaveBeenCalledWith('Unknown role');
  });

  // ---------------------------------------------------
  // FAILURE
  // ---------------------------------------------------
  it('should show error alert on login failure', () => {
    component.email = 'user@test.com';
    component.password = 'wrong';

    component.login();

    const req = httpMock.expectOne('/api/auth/login');

    req.flush(
      { message: 'Invalid credentials' },
      { status: 401, statusText: 'Unauthorized' }
    );

    expect(window.alert).toHaveBeenCalledWith('Invalid email or password');
  });
});

