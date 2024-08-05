import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Product,
  ProductResponse,
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

  getProductByBarCode(codigoBarras: string): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`/produto/${codigoBarras}`);
  }

  updateProduct(id: string, product: Product): Observable<Product> {
    return this.http.put<Product>(`/produto/${id}`, product);
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>('/produto', product);
  }

  deleteProductById(id: number): Observable<void> {
    return this.http.delete<void>(`/produto/${id}`);
  }
}
