import { Component, OnInit, Type } from '@angular/core';
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
import {
  Product,
  RegisterProduct,
} from '../../interfaces/productResponse.interface';
import { MatButtonModule } from '@angular/material/button';
import { ProductService } from '../../services/product.service';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
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
import {
  SnackBarService,
  SnackBarType,
} from '../../services/snack-bar.service';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { barCodeValidator } from '../../helpers/barCodeValidator';

@Component({
  selector: 'app-register-product',
  standalone: true,
  imports: [
    AsyncPipe,
    FormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    NgFor,
    ReactiveFormsModule,
    NgxMaskDirective,
    NgIf,
  ],
  providers: [provideNgxMask()],
  templateUrl: './register-product.component.html',
  styleUrl: './register-product.component.scss',
})
export class RegisterProductComponent implements OnInit {
  form: FormGroup;
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
    this.form = this.fb.group({
      codigoBarras: ['', [Validators.required, barCodeValidator()]],
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

    this.filteredOptions = this.form.controls['fabricante'].valueChanges.pipe(
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

  getProduct(barCode: string): void {
    this.productService.getProductByBarCode(barCode).subscribe((product) => {
      if (!product.content.length) {
        this.router.navigate(['/register-product/new']);
        this.snackBarService.openSnackBar(
          'Produto não encontrado.',
          SnackBarType.ERROR
        );
        return;
      }

      this.form.addControl('id', this.fb.control(''));

      this.form.patchValue({
        ...product.content[0],
        fabricante: product.content[0].fabricante.nome,
        fabricanteID: product.content[0].fabricante.id,
      });
      return;
    });
  }

  onManufacturerSelected(selectedName: string): void {
    const selectedManufacturer = this.options.find(
      (option) => option.nome === selectedName
    );
    if (selectedManufacturer) {
      this.form.controls['fabricanteID'].setValue(selectedManufacturer.id);
    }
  }

  get product(): RegisterProduct {
    return this.form.value as RegisterProduct;
  }

  registerProductForm(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.form.updateValueAndValidity();
      return;
    }

    if (this.product?.id) {
      this.productService.updateProduct(this.product).subscribe((product) => {
        if (product.id) {
          this.snackBarService.openSnackBar('Produto atualizado com sucesso!');
          this.productResponse(product);
        }
      });
      return;
    }

    this.productService.createProduct(this.product).subscribe((product) => {
      if (product.id) {
        this.snackBarService.openSnackBar('Produto cadastrado com sucesso!');
        this.productResponse(product);
      }
    });
  }

  productResponse(product: RegisterProduct): void {
    if (!product) {
      this.snackBarService.openSnackBar(
        'Erro ao cadastrar produto.',
        SnackBarType.ERROR
      );
      this.router.navigate(['/register-product/new']);
      return;
    }

    this.snackBarService.openSnackBar(
      `Produto ${this.product.id ? 'atualizado' : 'cadastrado'} com sucesso.`
    );

    this.form.patchValue(product);
  }
}
