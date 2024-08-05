import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Product } from '../../interfaces/productResponse.interface';
import { MatButtonModule } from '@angular/material/button';
import { ProductService } from '../../services/product.service';
import { AsyncPipe, NgFor } from '@angular/common';
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import {
  Manufacturer,
  ManufacturerResponse,
} from '../../interfaces/manufacturerResponse.interface';
import { ManufacturerService } from '../../services/manufacturer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from '../../services/snack-bar.service';

@Component({
  selector: 'app-register-product',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    AsyncPipe,
    NgFor,
  ],
  templateUrl: './register-product.component.html',
  styleUrl: './register-product.component.scss',
})
export class RegisterProductComponent implements OnInit {
  productForm: FormGroup;
  options: Manufacturer[] = [];
  filteredOptions: Observable<Manufacturer[]> = new Observable<
    Manufacturer[]
  >();

  barCode: string = '';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private manufacturerService: ManufacturerService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBarService: SnackBarService
  ) {
    this.productForm = this.fb.group({
      codigoBarras: ['', Validators.required],
      descricao: ['', Validators.required],
      fabricante: ['', Validators.required],
      fabricanteID: ['', Validators.required],
      nome: ['', Validators.required],
    });

    this.manufacturerService
      .getManufacturers()
      .subscribe(
        (response: ManufacturerResponse) => (this.options = response.content)
      );
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.barCode = params.get('id') || 'new';
      if (this.barCode !== 'new') {
        this.getProduct(this.barCode);
        return;
      }
    });

    this.filteredOptions = this.productForm.controls[
      'fabricante'
    ].valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value) => this._filter(value))
    );
  }

  private _filter(value: string): Observable<Manufacturer[]> {
    const filterValue = value.toLowerCase();

    return of(
      this.options.filter((option) =>
        option.nome.toLowerCase().includes(filterValue)
      )
    );
  }

  onManufacturerSelected(selectedName: string): void {
    const selectedManufacturer = this.options.find(
      (option) => option.nome === selectedName
    );
    if (selectedManufacturer) {
      this.productForm.controls['fabricanteID'].setValue(
        selectedManufacturer.id
      );
    }
  }

  get product(): Product {
    return this.productForm.value as Product;
  }

  registerProductForm(): void {
    if (!this.product?.id) {
      this.productService.createProduct(this.product).subscribe((product) => {
        if (product.id) {
          this.snackBarService.openSnackBar('Produto cadastrado com sucesso!');
          this.getProduct(product.codigoBarras);
        }
      });
      return;
    }

    this.productService.updateProduct(this.product).subscribe((product) => {
      if (product.id) {
        this.snackBarService.openSnackBar('Produto atualizado com sucesso!');
        this.getProduct(product.codigoBarras);
      }
    });
  }

  getProduct(barCode: string): void {
    this.productService.getProductByBarCode(barCode).subscribe((product) => {
      if (!product.content.length) {
        this.router.navigate(['/register-product/new']);
        return;
      }

      this.productForm.patchValue({
        ...product.content[0],
        fabricante: product.content[0].fabricante.nome,
        fabricanteID: product.content[0].fabricante.id,
      });
      return;
    });
  }
}
