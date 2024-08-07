import { Routes } from '@angular/router';
import { ManufacturerComponent } from './components/manufacturer/manufacturer.component';
import { ProductComponent } from './components/product/product.component';
import { RegisterManufacturerComponent } from './components/register-manufacturer/register-manufacturer.component';
import { RegisterProductComponent } from './components/register-product/register-product.component';

export const routes: Routes = [
  {
    component: ManufacturerComponent,
    data: { icon: 'users', showMenu: true, title: 'Fabricantes' },
    path: 'manufacturer',
  },
  {
    component: RegisterManufacturerComponent,
    data: { showMenu: false, title: 'Registrar Fabricante' },
    path: 'register-manufacturer/:id',
  },
  {
    component: ProductComponent,
    data: { icon: 'box', showMenu: true, title: 'Productos' },
    path: 'product',
  },
  {
    component: RegisterProductComponent,
    data: { showMenu: false, title: 'Registrar Producto' },
    path: 'register-product/:id',
  },
  {
    data: { showMenu: false },
    path: '',
    redirectTo: 'manufacturer',
    pathMatch: 'full',
  },
  {
    data: { showMenu: false },
    path: '**',
    redirectTo: 'manufacturer',
  },
];
