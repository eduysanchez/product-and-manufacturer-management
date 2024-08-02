import {
  AfterViewInit,
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ManufacturerService } from '../../services/manufacturer.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  Manufacturer,
  ManufacturerResponse,
} from '../../interfaces/manufacturerResponse.interface';
import { NgIf } from '@angular/common';
import { CustomMatPaginatorIntl } from '../../class/custom-mat-paginator-intl/custom-mat-paginator-intl';

@Component({
  selector: 'app-manufacturer',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    NgIf,
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl }],
  templateUrl: './manufacturer.component.html',
  styleUrl: './manufacturer.component.scss',
})
export class ManufacturerComponent
  implements AfterViewInit, OnInit, AfterViewChecked
{
  displayedColumns: string[] = ['nome', 'cnpj', 'endereço', 'ação'];
  dataSource: MatTableDataSource<Manufacturer> = new MatTableDataSource();
  manufacturers: ManufacturerResponse = {} as ManufacturerResponse;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private manufacturerService: ManufacturerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getManufacturer();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.setPaginator();
  }

  ngAfterViewChecked() {
    this.setPaginator();
  }

  getManufacturer(pageSize: number = 5, initialPage: number = 0) {
    this.manufacturerService
      .getAllManufacturers(pageSize, initialPage)
      .subscribe((manufacturers) => {
        this.manufacturers = manufacturers;
        this.dataSource = new MatTableDataSource(this.manufacturers.content);
        this.setPaginator();
      });
  }

  setPaginator() {
    if (this.paginator && this.manufacturers.content?.length) {
      this.paginator.length = this.manufacturers.totalElements;
      this.paginator.pageIndex = this.manufacturers.pageable.pageNumber;
      this.paginator.pageSize = this.manufacturers.pageable.pageSize;

      this.cdr.detectChanges();
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  handlePageEvent(pageEvent: PageEvent) {
    this.getManufacturer(pageEvent.pageSize, pageEvent.pageIndex);
  }
}
