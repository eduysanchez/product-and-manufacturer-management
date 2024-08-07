import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';

import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { MatBadge, MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

import { routes } from './app.routes';
import { NavRoute } from './interfaces/navRoute.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatBadge,
    MatBadgeModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    NgClass,
    NgIf,
    RouterModule,
    RouterOutlet,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  opened: boolean = true;
  hidden: boolean = false;
  hasBackdrop: boolean = false;

  navRoute: NavRoute[] = [];

  constructor(private breakpointObserver: BreakpointObserver) {
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

  ngOnInit(): void {
    this.breakpointObserver
      .observe(['(max-width: 1120px)', '(min-width: 1121px)'])
      .subscribe((state: BreakpointState) => {
        if (state.breakpoints['(max-width: 1120px)']) {
          this.opened = false;
          this.hasBackdrop = true;
        } else if (state.breakpoints['(min-width: 1121px)']) {
          this.opened = true;
          this.hasBackdrop = false;
        }
      });
  }

  toggleSidenav(): void {
    this.opened = !this.opened;
  }

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }
}
