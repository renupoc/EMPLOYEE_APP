import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeDashboardComponent } from './employee-dashboard.component';
import { AttendanceService } from '../../core/services/attendance.service';
import { EmployeeService } from '../../core/services/employee.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EmployeeDashboardComponent (Jest)', () => {
  let component: EmployeeDashboardComponent;
  let fixture: ComponentFixture<EmployeeDashboardComponent>;

  let attendanceServiceMock: {
    getSelectedDates: jest.Mock;
    submitAttendance: jest.Mock;
  };

  beforeEach(async () => {
    attendanceServiceMock = {
      getSelectedDates: jest.fn().mockReturnValue(of([])),
      submitAttendance: jest.fn().mockReturnValue(of({}))
    };

    // mock logged-in user BEFORE component init
    localStorage.setItem(
      'loggedInUser',
      JSON.stringify({ employeeId: 101 })
    );

    await TestBed.configureTestingModule({
      imports: [
        EmployeeDashboardComponent,
        HttpClientTestingModule
      ],
      providers: [
        { provide: AttendanceService, useValue: attendanceServiceMock },
        { provide: EmployeeService, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeDashboardComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  // ---------------- BASIC ----------------

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should generate years list', () => {
    component.generateYears();
    expect(component.years.length).toBe(10);
  });

  // ---------------- INIT ----------------

  it('should load user from localStorage', () => {
    expect(component.user.employeeId).toBe(101);
  });

  // ---------------- CALENDAR ----------------

  it('should calculate weekdays correctly', () => {
    const weekdays = component.calculateWeekdays(2024, 1);
    expect(weekdays).toBeGreaterThan(0);
  });

  it('should generate calendar days', () => {
    component.selectedMonth = 1;
    component.selectedYear = 2024;

    component.generateCalendar();

    expect(component.calendarDays.length).toBeGreaterThan(28);
  });

  it('should generate weeks summary', () => {
    component.selectedMonth = 1;
    component.selectedYear = 2024;

    component.generateWeeks();

    expect(component.weeks.length).toBeGreaterThan(0);
  });

  // ---------------- TOGGLE ----------------

  it('should toggle working day', () => {
    component.selectedMonth = 1;
    component.selectedYear = 2024;

    component.generateCalendar();
    component.generateWeeks();

    const day = component.calendarDays.find(
      d => !d.isWeekend && d.day !== 0
    )!;

    component.toggleDay(day);

    expect(day.isSelected).toBeTruthy();
    expect(component.workedDays).toBe(1);
  });

  it('should not toggle weekend', () => {
    const weekendDay: any = {
      date: new Date(),
      day: 1,
      isWeekend: true,
      isSelected: false
    };

    component.toggleDay(weekendDay);

    expect(weekendDay.isSelected).toBeFalsy();
  });

  // ---------------- FORM ----------------

  it('should validate form', () => {
    component.selectedMonth = 1;
    component.selectedYear = 2024;
    component.workedDays = 3;

    expect(component.isFormValid()).toBeTruthy();
  });

  // ---------------- SUBMIT ----------------

  it('should submit attendance', () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});

    component.selectedMonth = 1;
    component.selectedYear = 2024;
    component.daysInMonth = 31;
    component.weekdaysInMonth = 22;
    component.workedDays = 1;

    component.calendarDays = [
      {
        date: new Date(2024, 0, 1),
        day: 1,
        isWeekend: false,
        isSelected: true
      }
    ];

    component.submit();

    expect(attendanceServiceMock.submitAttendance).toHaveBeenCalled();
  });

  // ---------------- LOGOUT ----------------

  it('should logout correctly', () => {
    delete (window as any).location;

    (window as any).location = { href: '' };

    component.logout();

    expect(localStorage.getItem('loggedInUser')).toBeNull();
  });
});

