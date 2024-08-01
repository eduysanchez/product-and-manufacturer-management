import { Component } from '@angular/core';
import { ManufacturerService } from '../../services/manufacturer.service';

@Component({
  selector: 'app-manufacturer',
  standalone: true,
  imports: [],
  templateUrl: './manufacturer.component.html',
  styleUrl: './manufacturer.component.scss',
})
export class ManufacturerComponent {
  constructor(private manufacturerService: ManufacturerService) {
    this.manufacturerService
      .getAllManufacturers()
      .subscribe((manufacturers) => {
        console.log('manufacturers', manufacturers);
      });
  }
}
