import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GanttProgressComponent } from './gantt-progress.component';

describe('GanttProgressComponent', () => {
  let component: GanttProgressComponent;
  let fixture: ComponentFixture<GanttProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GanttProgressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GanttProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
