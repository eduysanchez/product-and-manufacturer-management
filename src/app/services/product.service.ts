import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Product,
  ProductResponse,
  RegisterProduct,
} from '../interfaces/productResponse.interface';
import { SnackBarService } from './snack-bar.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(
    private http: HttpClient,
    private snackBarService: SnackBarService
  ) {}

  getProducts(
    pageSize: number = 10,
    initialPage: number = 0
  ): Observable<ProductResponse> {
    let params = new HttpParams()
      .set('pageSize', pageSize.toString())
      .set('initialPage', initialPage.toString());

    return this.http.get<ProductResponse>(`/produto`, { params });
  }

  getProductByBarCode(
    codigoBarras: string,
    page: number = 0,
    size: number = 10,
    sort: string = 'string'
  ): Observable<ProductResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort.toString());

    return this.http.get<ProductResponse>(`/produto/${codigoBarras}`, {
      params,
    });
  }

  updateProduct(product: RegisterProduct): Observable<RegisterProduct> {
    return this.http.put<RegisterProduct>(`/produto/`, product);
  }

  createProduct(product: RegisterProduct): Observable<RegisterProduct> {
    return this.http.post<RegisterProduct>('/produto', product);
  }

  deleteProductById(id: number): Observable<void> {
    return this.http.delete<void>(`/produto/${id}`);
  }
}
