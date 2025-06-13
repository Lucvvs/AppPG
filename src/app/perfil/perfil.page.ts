import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  IonLabel
} from '@ionic/angular/standalone';
import { Location } from '@angular/common';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

// Componentes nuevos
import { MisDatosComponent } from '../mis-datos/mis-datos.component';
import { ExperienciaLaboralComponent } from '../experiencia-laboral/experiencia-laboral.component';
import { CertificacionesComponent } from '../certificaciones/certificaciones.component';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MisDatosComponent,
    ExperienciaLaboralComponent,
    CertificacionesComponent
  ],
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss']
})
export class PerfilPage implements OnInit {
  datosUsuario: any = {};
  segmentValue: string = 'datos';

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