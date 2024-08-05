import { Manufacturer } from './manufacturerResponse.interface';
import { Pageable } from './pageable.interface';
import { Sort } from './sort.interface';

export interface ProductResponse {
  content: Product[];
  pageable: Pageable;
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: Sort;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface Product {
  codigoBarras: string;
  descricao: string;
  fabricante: Manufacturer;
  id: number;
  nome: string;
}
