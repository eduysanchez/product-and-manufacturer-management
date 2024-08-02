import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ManufacturerService } from '../../services/manufacturer.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  Manufacturer,
  ManufacturerResponse,
} from '../../interfaces/manufacturerResponse.interface';
import { NgIf } from '@angular/common';

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
  templateUrl: './manufacturer.component.html',
  styleUrl: './manufacturer.component.scss',
})
export class ManufacturerComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['nome', 'cnpj', 'endereço', 'ação'];
  dataSource: MatTableDataSource<Manufacturer> = new MatTableDataSource();
  manufacturers: ManufacturerResponse = {} as ManufacturerResponse;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private manufacturerService: ManufacturerService) {}

  ngOnInit(): void {
    this.manufacturerService
      .getAllManufacturers()
      .subscribe((manufacturers) => {
        this.manufacturers = manufacturers;
        this.dataSource = new MatTableDataSource(this.manufacturers.content);
      });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator.length = this.manufacturers.totalElements;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
