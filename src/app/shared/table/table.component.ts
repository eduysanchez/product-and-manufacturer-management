import { NgFor, NgIf } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CustomMatPaginatorIntl } from '../../class/custom-mat-paginator-intl/custom-mat-paginator-intl';
import {
  MatButton,
  MatButtonModule,
  MatMiniFabButton,
} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatMiniFabButton,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    NgFor,
    NgIf,
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl }],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements AfterViewInit {
  @Input() dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @Input() paginator: MatPaginator;
  @Input() displayedColumns!: string[];

  @Output() pageEvent = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() filter = new EventEmitter<string>();
  @Output() register = new EventEmitter<boolean>();

  @ViewChild(MatSort) sort: MatSort = new MatSort();

  filterValue: string = '';

  constructor(
    private cdr: ChangeDetectorRef,
    private paginatorIntl: MatPaginatorIntl
  ) {
    this.paginator = new MatPaginator(this.paginatorIntl, this.cdr);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  handlePageEvent(event: any) {
    this.pageEvent.emit(event);
  }

  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
  }

  searchEvent() {
    this.filter.emit(this.filterValue);
  }

  navigateToRegister() {
    this.register.emit(true);
  }
}
