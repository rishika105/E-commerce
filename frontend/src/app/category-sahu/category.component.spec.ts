import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryComponent } from './category.component';

describe('CategoryComponent', () => {
  let component: CategoryComponent;
  let fixture: ComponentFixture<CategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have a list of categories', () => {
    expect(component.categories.length).toBeGreaterThan(0);
  });

  it('should have a list of products', () => {
    expect(component.products.length).toBeGreaterThan(0);
  });

  it('should filter products by category when onCategorySelect is called', () => {
    const category = 'Phones';
    component.onCategorySelect(category);
    expect(component.selectedCategory).toBe(category);
    expect(
      component.filteredProducts.every(
        (product) => product.category === category
      )
    ).toBe(true);
  });

  it('should update selectedCategory when onCategorySelect is called', () => {
    const category = 'Computers';
    component.onCategorySelect(category);
    expect(component.selectedCategory).toBe(category);
  });

  it('should display no products message when no products in category', () => {
    const category = 'NonExistentCategory';
    component.onCategorySelect(category);
    expect(component.filteredProducts.length).toBe(0);
    expect(component.selectedCategory).toBe(category);
  });

  it('should log left and right arrow clicks in onArrowClick method', () => {
    spyOn(console, 'log');
    component.onArrowClick('left');
    expect(console.log).toHaveBeenCalledWith('Arrow clicked: left');
    component.onArrowClick('right');
    expect(console.log).toHaveBeenCalledWith('Arrow clicked: right');
  });
});
