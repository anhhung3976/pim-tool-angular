import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideActionComponent } from './side-action.component';

describe('SideActionComponent', () => {
  let component: SideActionComponent;
  let fixture: ComponentFixture<SideActionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SideActionComponent]
    });
    fixture = TestBed.createComponent(SideActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
