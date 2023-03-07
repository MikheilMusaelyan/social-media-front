import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageNameComponent } from './image-name.component';

describe('ImageNameComponent', () => {
  let component: ImageNameComponent;
  let fixture: ComponentFixture<ImageNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageNameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
