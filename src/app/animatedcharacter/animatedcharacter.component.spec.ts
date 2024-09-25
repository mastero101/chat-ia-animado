import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimatedcharacterComponent } from './animatedcharacter.component';

describe('AnimatedcharacterComponent', () => {
  let component: AnimatedcharacterComponent;
  let fixture: ComponentFixture<AnimatedcharacterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimatedcharacterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnimatedcharacterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
