import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable()
export class CustomMatPaginatorIntl extends MatPaginatorIntl {
  override itemsPerPageLabel: string = 'Showing';
  override nextPageLabel: string = '';
  override previousPageLabel: string = '';
  override firstPageLabel: string = '';
  override lastPageLabel: string = '';

  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 de ${length}`;
    }
    
    return `of ${length}`;
  };
}
