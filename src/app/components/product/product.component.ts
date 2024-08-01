import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent {
  constructor(private productService: ProductService) {
    this.productService.getAllProducts().subscribe((products) => {
      console.log('products', products);
    });
  }
}
