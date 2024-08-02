import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomMatPaginatorIntl } from './custom-mat-paginator-intl';

describe('CustomMatPaginatorIntl', () => {
  let component: CustomMatPaginatorIntl;
  let fixture: ComponentFixture<CustomMatPaginatorIntl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomMatPaginatorIntl],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomMatPaginatorIntl);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
