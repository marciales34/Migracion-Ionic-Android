import { Component } from '@angular/core';
import { FotoService } from '../services/foto.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page {

  constructor(public fotoService: FotoService) {} // Inyecta el servicio

  tomarFoto() {
    this.fotoService.AñadirImagenGaleria();  // Llama al método del servicio
  }

  async ngOnInit(){

    await this.fotoService.loadSaved()
    
  }

}
