import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeartPage } from './heart.page';

describe('HeartPage', () => {
  let component: HeartPage;
  let fixture: ComponentFixture<HeartPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HeartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
