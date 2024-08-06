import { Pageable } from './pageable.interface';
import { Sort } from './sort.interface';

export interface ManufacturerResponse {
  content: Manufacturer[];
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

export interface Manufacturer {
  id: number;
  nome: string;
  cnpj: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  contatoTipo: string;
  contato: string;
}