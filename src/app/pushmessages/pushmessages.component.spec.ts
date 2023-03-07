import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PushmessagesComponent } from './pushmessages.component';

describe('PushmessagesComponent', () => {
  let component: PushmessagesComponent;
  let fixture: ComponentFixture<PushmessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PushmessagesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PushmessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
