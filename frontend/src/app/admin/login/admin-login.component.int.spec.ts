import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminLoginComponent } from './admin-login.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('AdminLoginComponent – Integration Test', () => {
  let fixture: ComponentFixture<AdminLoginComponent>;
  let component: AdminLoginComponent;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AdminLoginComponent,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminLoginComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);

    jest.spyOn(window, 'alert').mockImplementation(() => {});
    jest.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
    jest.clearAllMocks();
    localStorage.clear();
  });

  // ---------------------------------------------------
  // SUCCESS – ADMIN LOGIN
  // ---------------------------------------------------
  it('should login admin and navigate to admin dashboard', () => {
    component.email = 'admin@test.com';
    component.password = 'admin123';

    component.login();

    const req = httpMock.expectOne('/api/auth/login');

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      email: 'admin@test.com',
      password: 'admin123'
    });

    req.flush({
      role: 'ADMIN',
      employeeId: 101,
      email: 'admin@test.com'
    });

    expect(localStorage.getItem('loggedInUser')).toContain('ADMIN');
    expect(localStorage.getItem('adminId')).toBe('101');
    expect(router.navigate).toHaveBeenCalledWith(['/admin-dashboard']);
  });

  // ---------------------------------------------------
  // FAILURE – NON ADMIN
  // ---------------------------------------------------
  it('should block login if role is not ADMIN', () => {
    component.email = 'emp@test.com';
    component.password = '123';

    component.login();

    const req = httpMock.expectOne('/api/auth/login');

    req.flush({
      role: 'EMPLOYEE',
      employeeId: 201
    });

    expect(window.alert).toHaveBeenCalledWith('Access denied. Admin only.');
    expect(router.navigate).not.toHaveBeenCalled();
  });

  // ---------------------------------------------------
  // FAILURE – INVALID CREDENTIALS
  // ---------------------------------------------------
  it('should show error alert on login failure', () => {
    component.email = 'admin@test.com';
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

