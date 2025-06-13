import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonList, IonItem, IonLabel, IonCard, IonCardContent, IonCardTitle } from '@ionic/angular/standalone';

@Component({
  selector: 'app-mis-datos',
  standalone: true,
  imports: [
    CommonModule,
    IonList,
    IonItem,
    IonLabel,
    IonCard,
    IonCardTitle,
    IonCardContent
  ],
  templateUrl: './mis-datos.component.html',
  styleUrls: ['./mis-datos.component.scss']
})
export class MisDatosComponent implements OnInit {
  datosUsuario: any = {};
  cantidadCertificaciones = 0;
  ultimaExperiencia: any = null;

  ngOnInit(): void {
    const datos = localStorage.getItem('datosUsuario');
    if (datos) {
      this.datosUsuario = JSON.parse(datos);
    }

    const certs = localStorage.getItem('certificaciones');
    if (certs) {
      const parsed = JSON.parse(certs);
      this.cantidadCertificaciones = parsed.length;
    }

    const experiencias = localStorage.getItem('experienciasLaborales');
    if (experiencias) {
      const lista = JSON.parse(experiencias);
      this.ultimaExperiencia = lista[lista.length - 1]; // última agregada
    }
  }
}