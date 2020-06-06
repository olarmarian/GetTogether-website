import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalRegisterDialogComponent } from './local-register-dialog.component';

describe('LocalRegisterDialogComponent', () => {
  let component: LocalRegisterDialogComponent;
  let fixture: ComponentFixture<LocalRegisterDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalRegisterDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalRegisterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
