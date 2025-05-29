import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Location } from '@angular/common';

// Angular Material 
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss']
})
export class PerfilPage implements OnInit {
  datosUsuario: any = {};

  constructor(private location: Location) {} 

  ngOnInit() {
    const datos = localStorage.getItem('datosUsuario');
    if (datos) {
      this.datosUsuario = JSON.parse(datos);
    }
  }

  volverAtras() {
    this.location.back(); 
  }
}