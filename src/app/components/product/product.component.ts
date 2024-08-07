import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ViewChild,
} from '@angular/core';
import { ProductService } from '../../services/product.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  Product,
  ProductResponse,
} from '../../interfaces/productResponse.interface';
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { Router } from '@angular/router';
import {
  SnackBarService,
  SnackBarType,
} from '../../services/snack-bar.service';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule, MatMiniFabButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { MatIconModule } from '@angular/material/icon';
import { CustomMatPaginatorIntl } from '../../class/custom-mat-paginator-intl/custom-mat-paginator-intl';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    AsyncPipe,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatMiniFabButton,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    NgFor,
    NgIf,
    NgxMaskDirective,
    NgxMaskPipe,
    ReactiveFormsModule,
    MatIconModule,
  ],
  providers: [
    provideNgxMask(),
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl },
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent implements AfterViewInit {
  form: FormGroup;
  applyFilter: boolean = false;

  dataSource: MatTableDataSource<Product> = new MatTableDataSource();
  displayedColumns: string[] = ['produto', 'fabricante', 'descrição', 'ação'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort = new MatSort();

  products: ProductResponse = {} as ProductResponse;

  private pageEventSubject = new Subject<PageEvent>();
  page: number = 0;
  length: number = 0;
  pageIndex: number = 0;
  pageSize: number = 0;
  pageSizeOptions: number[] = [10, 20, 50, 100];

  p: number = 1;

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private paginatorIntl: MatPaginatorIntl,
    private productService: ProductService,
    private router: Router,
    private snackBarService: SnackBarService
  ) {
    this.form = this.fb.group({
      barCode: ['', Validators.required],
    });

    this.paginator = new MatPaginator(this.paginatorIntl, this.cdr);
    this.loadProducts();

    this.pageEventSubject
      .pipe(debounceTime(300))
      .subscribe((event) => this.handlePageEvent(event));
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.setPaginator();
    this.cdr.detectChanges();
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
    if (this.products && this.products.pageable) {
      this.length = this.products.totalElements;
      this.pageIndex = this.products.pageable.pageNumber;
      this.pageSize = this.products.pageable.pageSize;
    }
  }

  onPageEvent(event: PageEvent) {
    this.pageEventSubject.next(event);
  }

  handlePageEvent(pageEvent: PageEvent) {
    this.loadProducts(pageEvent.pageSize, pageEvent.pageIndex);
  }

  searchProductByBarCode() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.form.updateValueAndValidity();
      return;
    }

    this.productService
      .getProductByBarCode(this.form.controls['barCode'].value)
      .subscribe((products) => {
        this.products = products;
        this.setTableDataSource(this.products.content);
        this.applyFilter = true;
      });
  }

  resetFormBarCode(): void {
    this.form.reset();
    this.applyFilter = false;
    this.loadProducts();
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
