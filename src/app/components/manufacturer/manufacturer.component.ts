import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { ManufacturerService } from '../../services/manufacturer.service';
import {
  MatPaginator,
  MatPaginatorIntl,
  PageEvent,
} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {
  Manufacturer,
  ManufacturerResponse,
  ManufacturerTableData,
} from '../../interfaces/manufacturerResponse.interface';
import { TableComponent } from '../../shared/table/table.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manufacturer',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './manufacturer.component.html',
  styleUrl: './manufacturer.component.scss',
})
export class ManufacturerComponent {
  dataSource: MatTableDataSource<ManufacturerTableData> =
    new MatTableDataSource();

  paginator: MatPaginator;

  displayedColumns: string[] = ['nome', 'cnpj', 'endereço', 'ação'];

  manufacturers: ManufacturerResponse = {} as ManufacturerResponse;

  page: number = 0;

  constructor(
    private manufacturerService: ManufacturerService,
    private cdr: ChangeDetectorRef,
    private paginatorIntl: MatPaginatorIntl,
    private router: Router
  ) {
    this.paginator = new MatPaginator(this.paginatorIntl, this.cdr);
    this.loadManufacturers();
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
    this.dataSource = new MatTableDataSource(
      manufacturers.map((manufacturer) => ({
        nome: manufacturer.nome,
        cnpj: manufacturer.cnpj,
        endereço: `${manufacturer.logradouro}, ${manufacturer.numero}, ${manufacturer.bairro}, ${manufacturer.cidade}, ${manufacturer.estado}, ${manufacturer.cep}`,
        id: manufacturer.id,
      }))
    );

    this.setPaginator();
  }

  setPaginator() {
    if (this.paginator) {
      this.paginator.length = this.manufacturers.totalElements;
      this.paginator.pageIndex = this.manufacturers.pageable.pageNumber;
      this.paginator.pageSize = this.manufacturers.pageable.pageSize;
      this.paginator.pageSizeOptions = [10, 25, 50, 100];
    }
  }

  handlePageEvent(pageEvent: PageEvent) {
    this.loadManufacturers(pageEvent.pageSize, pageEvent.pageIndex);
  }

  searchManufacturerByCnpj(cnpj: string) {
    this.manufacturerService
      .getManufacturerByCnpj(cnpj)
      .subscribe((manufacturers) => {
        this.manufacturers = manufacturers;
        this.setTableDataSource(this.manufacturers.content);
      });
  }

  registerManufacturer() {
    this.router.navigate(['/register-manufacturer/new']);
  }

  editManufacturer(manufacturer: ManufacturerTableData): void {
    console.log('Edit manufacturer:', manufacturer);
  }

  deleteManufacturer(manufacturer: ManufacturerTableData): void {
    this.manufacturerService.deletePessoaById(manufacturer.id).subscribe(() => {
      this.loadManufacturers();
    });
  }
}
