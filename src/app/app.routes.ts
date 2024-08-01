import { Routes } from '@angular/router';
import { ManufacturerComponent } from './components/manufacturer/manufacturer.component';
import { ProductComponent } from './components/product/product.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'manufacturer',
    pathMatch: 'full',
  },
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
];
