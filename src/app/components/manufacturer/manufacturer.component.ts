import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ViewChild,
} from '@angular/core';
import { ManufacturerService } from '../../services/manufacturer.service';
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  Manufacturer,
  ManufacturerResponse,
} from '../../interfaces/manufacturerResponse.interface';
import { Router } from '@angular/router';
import { SnackBarService } from '../../services/snack-bar.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { CustomMatPaginatorIntl } from '../../class/custom-mat-paginator-intl/custom-mat-paginator-intl';
import { MatButtonModule, MatMiniFabButton } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-manufacturer',
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
  templateUrl: './manufacturer.component.html',
  styleUrl: './manufacturer.component.scss',
})
export class ManufacturerComponent implements AfterViewInit {
  form: FormGroup;
  applyFilter: boolean = false;

  dataSource: MatTableDataSource<Manufacturer> = new MatTableDataSource();
  displayedColumns: string[] = ['nome', 'cnpj', 'endereço', 'ação'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort = new MatSort();

  manufacturers: ManufacturerResponse = {} as ManufacturerResponse;

  private pageEventSubject = new Subject<PageEvent>();
  page: number = 0;
  length: number = 0;
  pageIndex: number = 0;
  pageSize: number = 0;
  pageSizeOptions: number[] = [10, 25, 50, 100];

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private manufacturerService: ManufacturerService,
    private paginatorIntl: MatPaginatorIntl,
    private router: Router,
    private snackBarService: SnackBarService
  ) {
    this.form = this.fb.group({
      cnpj: ['', Validators.required],
    });

    this.paginator = new MatPaginator(this.paginatorIntl, this.cdr);
    this.loadManufacturers();

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

  loadManufacturers(pageSize: number = 10, initialPage: number = 0) {
    this.manufacturerService
      .getManufacturers(pageSize, initialPage)
      .subscribe((manufacturers) => {
        this.manufacturers = manufacturers;
        this.setTableDataSource(manufacturers.content);
      });
  }

  setTableDataSource(manufacturers: Manufacturer[]) {
    this.dataSource = new MatTableDataSource(manufacturers);
    this.setPaginator();
  }

  setPaginator() {
    if (this.manufacturers && this.manufacturers.pageable) {
      this.length = this.manufacturers.totalElements;
      this.pageIndex = this.manufacturers.pageable.pageNumber;
      this.pageSize = this.manufacturers.pageable.pageSize;
    }
  }

  onPageEvent(event: PageEvent) {
    this.pageEventSubject.next(event);
  }

  handlePageEvent(pageEvent: PageEvent) {
    this.loadManufacturers(pageEvent.pageSize, pageEvent.pageIndex);
  }

  searchManufacturerByCnpj() {
    this.manufacturerService
      .getManufacturerByCnpj(this.form.controls['cnpj'].value)
      .subscribe((manufacturers) => {
        this.manufacturers = manufacturers;
        this.setTableDataSource(this.manufacturers.content);
        this.applyFilter = true;
      });
  }

  registerManufacturer() {
    this.router.navigate(['/register-manufacturer/new']);
  }

  editManufacturer(manufacturer: Manufacturer): void {
    this.router.navigate(['/register-manufacturer', manufacturer.cnpj]);
  }

  deleteManufacturer(manufacturer: Manufacturer): void {
    this.manufacturerService.deletePessoaById(manufacturer.id).subscribe(() => {
      this.snackBarService.openSnackBar('Fabricante excluído com sucesso!');
      this.loadManufacturers();
    });
  }

  getAddress(manufacturer: Manufacturer): string {
    return `${manufacturer.logradouro}, ${manufacturer.numero}, ${manufacturer.bairro}, ${manufacturer.cidade} - ${manufacturer.estado}`;
  }
}
