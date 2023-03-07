import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveFriendsComponent } from './active-friends.component';

describe('ActiveFriendsComponent', () => {
  let component: ActiveFriendsComponent;
  let fixture: ComponentFixture<ActiveFriendsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActiveFriendsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveFriendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
