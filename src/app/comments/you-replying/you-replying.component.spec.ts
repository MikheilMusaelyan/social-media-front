import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YouReplyingComponent } from './you-replying.component';

describe('YouReplyingComponent', () => {
  let component: YouReplyingComponent;
  let fixture: ComponentFixture<YouReplyingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YouReplyingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YouReplyingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
