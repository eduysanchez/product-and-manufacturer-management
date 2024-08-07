import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { routes } from './app.routes';
import { NavRoute } from './interfaces/navRoute.interface';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    NgIf,
    NgClass,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  opened: boolean = true;

  navRoute: NavRoute[] = [];

  constructor() {
    this.navRoute = routes
      .map((route) => {
        if (route.data?.['showMenu']) {
          return {
            icon: route.data?.['icon'],
            path: route.path,
            title: route.data?.['title'],
          } as NavRoute;
        }
        return null;
      })
      .filter((route): route is NavRoute => route !== null);
  }

  toggleSidenav(): void {
    this.opened = !this.opened;
  }
}
