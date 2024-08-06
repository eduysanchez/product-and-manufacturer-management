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
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import {
  Manufacturer,
  TypeContact,
} from '../../interfaces/manufacturerResponse.interface';
import { ManufacturerService } from '../../services/manufacturer.service';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MatSelectModule } from '@angular/material/select';

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
    MatSelectModule,
    NgIf,
  ],
  providers: [provideNgxMask()],
  templateUrl: './register-manufacturer.component.html',
  styleUrl: './register-manufacturer.component.scss',
})
export class RegisterManufacturerComponent implements OnInit {
  form: FormGroup;

  cnpj: string = '';
  typeContact = TypeContact;
  typeContactKeys = Object.keys(TypeContact) as Array<keyof typeof TypeContact>;

  constructor(
    private fb: FormBuilder,
    private manufacturerService: ManufacturerService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBarService: SnackBarService
  ) {
    this.form = this.fb.group({
      cnpj: ['', Validators.required],
      nome: ['', Validators.required],
      cep: ['', Validators.required],
      logradouro: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: [''],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],
      estado: ['', Validators.required],
      contatoTipo: [TypeContact.Email],
      contato: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.cnpj = params.get('id') || 'new';
      if (this.cnpj !== 'new') {
        this.getManufacturer(this.cnpj);
        return;
      }
    });

    this.form
      .get('contatoTipo')
      ?.valueChanges.subscribe((value) => {
        this.setContactValidators(value);
      });

    this.getCep();
  }

  get manufacturer() {
    return this.form.value as Manufacturer;
  }

  get selectedContactType() {
    return this.form.get('contatoTipo')?.value;
  }

  setContactValidators(typeContact: TypeContact) {
    const contatoControl = this.form.get('contato');
    if (typeContact === TypeContact.Email) {
      contatoControl?.setValidators(Validators.required);
      contatoControl?.setValue('');
    } else if (typeContact === TypeContact.Phone) {
      contatoControl?.setValidators(Validators.required);
      contatoControl?.setValue('');
    }
    contatoControl?.updateValueAndValidity();
  }

  getCep() {
    this.form.controls['cep'].valueChanges.subscribe((cep) => {
      if (cep.length === 8) {
        this.manufacturerService.getAddressByCep(cep).subscribe((address) => {
          this.form.controls['logradouro'].setValue(
            address.logradouro
          );
          this.form.controls['complemento'].setValue(
            address.complemento
          );
          this.form.controls['bairro'].setValue(address.bairro);
          this.form.controls['cidade'].setValue(address.localidade);
          this.form.controls['estado'].setValue(address.uf);
        });
      }
    });
  }

  getManufacturer(cnpj: string) {
    this.manufacturerService
      .getManufacturerByCnpj(cnpj)
      .subscribe((manufacturer) => {
        if (!manufacturer.content.length) {
          this.router.navigate(['/register-manufacturer/new']);
          return;
        }

        this.form.addControl('id', this.fb.control(''));

        this.form.patchValue({
          ...manufacturer.content[0],
        });
        return;
      });
  }

  registerManufacturerForm() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.form.updateValueAndValidity();
      return;
    }

    if (this.manufacturer.id) {
      this.manufacturerService
        .updateManufacturer(this.manufacturer)
        .subscribe((manufacturer) => {
          this.manufacturerResponse(manufacturer);
        });
      return;
    }

    this.manufacturerService
      .createManufacturer(this.manufacturer)
      .subscribe((manufacturer) => {
        this.manufacturerResponse(manufacturer);
      });
  }

  manufacturerResponse(manufacturer: Manufacturer) {
    if (!manufacturer) {
      this.snackBarService.openSnackBar(
        'Erro ao cadastrar fabricante!',
        SnackBarType.ERROR
      );
      this.router.navigate(['/register-manufacturer/new']);
      return;
    }

    this.snackBarService.openSnackBar(
      `Fabricante ${
        this.manufacturer.id ? 'atualizado' : 'cadastrado'
      } com sucesso!`
    );

    this.form.patchValue(manufacturer);
  }
}
