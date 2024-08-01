import { Routes } from '@angular/router';
import { ManufacturerComponent } from './components/manufacturer/manufacturer.component';
import { ProductComponent } from './components/product/product.component';

export const routes: Routes = [
  {
    component: ManufacturerComponent,
    data: { title: 'Fabricantes' },
    path: 'manufacturer',
  },
  {
    component: ProductComponent,
    data: { title: 'Productos' },
    path: 'product',
  },
  {
    path: '',
    redirectTo: 'manufacturer',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'manufacturer',
  },
];
