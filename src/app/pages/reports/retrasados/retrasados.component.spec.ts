import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetrasadosComponent } from './retrasados.component';

describe('RetrasadosComponent', () => {
  let component: RetrasadosComponent;
  let fixture: ComponentFixture<RetrasadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RetrasadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetrasadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
