import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateContent } from './generate-content.component';

describe('GenerateContent', () => {
  let component: GenerateContent;
  let fixture: ComponentFixture<GenerateContent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateContent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateContent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
