import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalCardComponent } from './local-card.component';

describe('LocalCardComponent', () => {
  let component: LocalCardComponent;
  let fixture: ComponentFixture<LocalCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
