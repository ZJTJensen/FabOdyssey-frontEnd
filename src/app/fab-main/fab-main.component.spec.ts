import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FabMainComponent } from './fab-main.component';

describe('FabMainComponent', () => {
  let component: FabMainComponent;
  let fixture: ComponentFixture<FabMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FabMainComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FabMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
