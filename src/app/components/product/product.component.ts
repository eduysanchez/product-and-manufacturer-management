import { ChangeDetectorRef, Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { TableComponent } from '../../shared/table/table.component';
import { MatTableDataSource } from '@angular/material/table';
import {
  Product,
  ProductResponse,
} from '../../interfaces/productResponse.interface';
import {
  MatPaginator,
  MatPaginatorIntl,
  PageEvent,
} from '@angular/material/paginator';
import { Router } from '@angular/router';
import {
  SnackBarService,
  SnackBarType,
} from '../../services/snack-bar.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent {
  dataSource: MatTableDataSource<Product> = new MatTableDataSource();

  paginator: MatPaginator;

  displayedColumns: string[] = ['produto', 'fabricante', 'descricao', 'ação'];

  products: ProductResponse = {} as ProductResponse;

  page: number = 0;

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
    private paginatorIntl: MatPaginatorIntl,
    private router: Router,
    private snackBarService: SnackBarService
  ) {
    this.paginator = new MatPaginator(this.paginatorIntl, this.cdr);
    this.loadProducts();
  }

  loadProducts(pageSize: number = 10, initialPage: number = 0) {
    this.productService
      .getProducts(pageSize, initialPage)
      .subscribe((products) => {
        this.products = products;
        this.setTableDataSource(this.products.content);
      });
  }

  setTableDataSource(products: Product[]) {
    this.dataSource = new MatTableDataSource(products);

    this.setPaginator();
  }

  setPaginator() {
    if (this.paginator) {
      this.paginator.length = this.products.totalElements;
      this.paginator.pageIndex = this.products.pageable.pageNumber;
      this.paginator.pageSize = this.products.pageable.pageSize;
      this.paginator.pageSizeOptions = [10, 25, 50, 100];
    }
  }

  handlePageEvent(pageEvent: PageEvent) {
    this.loadProducts(pageEvent.pageSize, pageEvent.pageIndex);
  }

  searchProductByBarCode(barCode: string) {
    this.productService.getProductByBarCode(barCode).subscribe((products) => {
      this.products = products;
      this.setTableDataSource(this.products.content);
    });
  }

  registerProduct() {
    this.router.navigate(['/register-product/new']);
  }

  editProduct(product: Product): void {
    this.router.navigate(['/register-product', product.codigoBarras]);
  }

  deleteProduct(product: Product): void {
    this.productService.deleteProductById(product.id).subscribe(() => {
      this.snackBarService.openSnackBar(
        'Produto excluído com sucesso!',
        SnackBarType.SUCCESS
      );
      this.loadProducts();
    });
  }
}
