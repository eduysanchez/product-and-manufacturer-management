import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  Manufacturer,
  ManufacturerResponse,
} from '../interfaces/manufacturerResponse.interface';

@Injectable({
  providedIn: 'root',
})
export class ManufacturerService {
  constructor(private http: HttpClient) {}

  getAllManufacturers(
    pageSize: number = 10,
    initialPage: number = 0
  ): Observable<ManufacturerResponse> {
    const params = new HttpParams()
      .set('pageSize', pageSize.toString())
      .set('initialPage', initialPage.toString());

    return this.http.get<ManufacturerResponse>(`/pessoa`, { params });
    // .pipe(
    //   map((response) => {
    //     return response.content;
    //   })
    // );
  }

  updateManufacturer(manufacturer: Manufacturer): Observable<Manufacturer> {
    return this.http.put<Manufacturer>(`/pessoa`, manufacturer);
  }

  createManufacturer(manufacturer: Manufacturer): Observable<Manufacturer> {
    return this.http.post<Manufacturer>(`/pessoa`, manufacturer);
  }

  getManufacturerByCnpj(
    cnpj: string,
    page: number = 0,
    size: number = 10,
    sort: string = 'string'
  ): Observable<ManufacturerResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);

    return this.http.get<ManufacturerResponse>(`/pessoa/${cnpj}`, { params });
  }

  getManufacturerByName(
    name: string,
    page: number = 0,
    size: number = 10,
    sort: string = 'string'
  ): Observable<ManufacturerResponse> {
    const params = new HttpParams()
      .set('nome', name)
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);

    return this.http.get<ManufacturerResponse>(`/pessoa/pessoas`, { params });
  }

  deletePessoaById(id: string): Observable<any> {
    return this.http.delete<any>(`/pessoa/${id}`);
  }
}
