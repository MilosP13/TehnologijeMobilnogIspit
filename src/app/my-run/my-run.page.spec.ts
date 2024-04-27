import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyRunPage } from './my-run.page';

describe('MyRunPage', () => {
  let component: MyRunPage;
  let fixture: ComponentFixture<MyRunPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MyRunPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
