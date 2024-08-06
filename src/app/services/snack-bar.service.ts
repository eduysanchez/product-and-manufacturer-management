import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export enum SnackBarType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  constructor(private _snackBar: MatSnackBar) {}

  openSnackBar(message: string, type: SnackBarType = SnackBarType.SUCCESS) {
    this._snackBar.open(message, '', {
      duration: 5000,
      panelClass: [`snack-bar-${type}`],
    });
  }
}
