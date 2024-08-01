import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Product,
  ProductResponse,
} from '../interfaces/productResponse.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getAllProducts(
    pageSize: number = 10,
    initialPage: number = 0
  ): Observable<ProductResponse> {
    let params = new HttpParams()
      .set('pageSize', pageSize.toString())
      .set('initialPage', initialPage.toString());

    return this.http.get<ProductResponse>(`/produto`, { params });
  }

  getProductByCodigoBarras(
    codigoBarras: string,
    page: number = 0,
    size: number = 10,
    sort: string = 'string'
  ): Observable<ProductResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);

    return this.http.get<ProductResponse>(`/produto/${codigoBarras}`, {
      params,
    });
  }

  updateProduct(id: string, product: Product): Observable<Product> {
    return this.http.put<Product>(`/produto/${id}`, product);
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>('/produto', product);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`/produto/${id}`);
  }
}
