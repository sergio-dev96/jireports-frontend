import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenVersionComponent } from './resumen-version.component';

describe('ResumenVersionComponent', () => {
  let component: ResumenVersionComponent;
  let fixture: ComponentFixture<ResumenVersionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumenVersionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumenVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
