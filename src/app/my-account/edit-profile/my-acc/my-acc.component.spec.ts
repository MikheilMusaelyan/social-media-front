import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAccComponent } from './my-acc.component';

describe('MyAccComponent', () => {
  let component: MyAccComponent;
  let fixture: ComponentFixture<MyAccComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyAccComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyAccComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
