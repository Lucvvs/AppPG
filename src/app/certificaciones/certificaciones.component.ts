import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonDatetime,
  IonCheckbox,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-certificaciones',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonDatetime,
    IonCheckbox,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent
  ],
  templateUrl: './certificaciones.component.html',
  styleUrls: ['./certificaciones.component.scss']
})
export class CertificacionesComponent implements OnInit {
  vence = false;

  certificacion = {
    nombre: '',
    fechaObtencion: '',
    fechaVencimiento: ''
  };

  certificaciones: any[] = [];

  ngOnInit(): void {
    const guardadas = localStorage.getItem('certificaciones');
    if (guardadas) {
      this.certificaciones = JSON.parse(guardadas);
    }
  }

  agregarCertificacion() {
    const nueva = { ...this.certificacion };

    if (!this.vence) {
      nueva.fechaVencimiento = 'Sin vencimiento';
    }

    this.certificaciones.push(nueva);

    // Guardar en localStorage
    localStorage.setItem('certificaciones', JSON.stringify(this.certificaciones));

    // Limpiar formulario
    this.certificacion = {
      nombre: '',
      fechaObtencion: '',
      fechaVencimiento: ''
    };
    this.vence = false;
  }
}