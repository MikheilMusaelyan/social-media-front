import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendsLeftComponent } from './friends-left.component';

describe('FriendsLeftComponent', () => {
  let component: FriendsLeftComponent;
  let fixture: ComponentFixture<FriendsLeftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FriendsLeftComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FriendsLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
