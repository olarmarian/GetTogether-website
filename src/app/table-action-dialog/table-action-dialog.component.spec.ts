import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableActionDialogComponent } from './table-action-dialog.component';

describe('TableActionDialogComponent', () => {
  let component: TableActionDialogComponent;
  let fixture: ComponentFixture<TableActionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableActionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableActionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
