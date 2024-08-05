import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  SnackBarService,
  SnackBarType,
} from '../../services/snack-bar.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AsyncPipe, NgFor } from '@angular/common';
import { Manufacturer } from '../../interfaces/manufacturerResponse.interface';
import { ManufacturerService } from '../../services/manufacturer.service';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-register-manufacturer',
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
    NgxMaskDirective,
  ],
  providers: [provideNgxMask()],
  templateUrl: './register-manufacturer.component.html',
  styleUrl: './register-manufacturer.component.scss',
})
export class RegisterManufacturerComponent implements OnInit {
  manufacturerForm: FormGroup;

  cnpj: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBarService: SnackBarService,
    private manufacturerService: ManufacturerService
  ) {
    this.manufacturerForm = this.fb.group({
      cnpj: ['', Validators.required],
      nome: ['', Validators.required],
      cep: ['', [Validators.required, Validators.pattern(/^\d{5}-\d{3}$/)]],
      endereco: [{ value: '', disabled: true }, Validators.required],
      numero: ['', Validators.required],
      complemento: ['', Validators.required],
      bairro: [{ value: '', disabled: true }, Validators.required],
      cidade: [{ value: '', disabled: true }, Validators.required],
      estado: [{ value: '', disabled: true }, Validators.required],
    });
  }

  ngOnInit(): void {
    this.manufacturerForm.controls['cep'].valueChanges.subscribe((cep) => {
      if (cep.length === 8) {
        this.manufacturerService.getAddressByCep(cep).subscribe((address) => {
          this.manufacturerForm.controls['endereco'].setValue(
            address.logradouro
          );
          this.manufacturerForm.controls['complemento'].setValue(
            address.complemento
          );
          this.manufacturerForm.controls['bairro'].setValue(address.bairro);
          this.manufacturerForm.controls['cidade'].setValue(address.localidade);
          this.manufacturerForm.controls['estado'].setValue(address.uf);
        });
      }
    });
  }

  get manufacturer() {
    return this.manufacturerForm.value as Manufacturer;
  }

  registerManufacturerForm() {
    console.log('Manufacturer form:', this.manufacturer);
    this.manufacturerService
      .createManufacturer(this.manufacturer)
      .subscribe((manufacturer) => {
        if (!manufacturer) {
          this.snackBarService.openSnackBar(
            'Erro ao cadastrar fabricante!',
            SnackBarType.ERROR
          );
          this.router.navigate(['/register-manufacturer/new']);
          return;
        }

        this.snackBarService.openSnackBar('Fabricante cadastrado com sucesso!');
        this.manufacturerForm.patchValue(manufacturer);
      });
  }
}
