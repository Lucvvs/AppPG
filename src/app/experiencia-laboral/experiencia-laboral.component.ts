import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonList, IonItem, IonLabel, IonInput, IonCheckbox, IonButton,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-experiencia-laboral',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonCheckbox,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent
  ],
  templateUrl: './experiencia-laboral.component.html',
  styleUrls: ['./experiencia-laboral.component.scss']
})
export class ExperienciaLaboralComponent implements OnInit {
  trabajaActualmente = false;

  experiencia = {
    empresa: '',
    anioInicio: '',
    anioTermino: '',
    cargo: ''
  };

  experiencias: any[] = [];

  ngOnInit(): void {
    const guardadas = localStorage.getItem('experienciasLaborales');
    if (guardadas) {
      this.experiencias = JSON.parse(guardadas);
    }
  }

  agregarExperiencia() {
    const nuevaExp = { ...this.experiencia };

    if (this.trabajaActualmente) {
      nuevaExp.anioTermino = 'Actualidad';
    }

    this.experiencias.push(nuevaExp);

    // Guardar en localStorage
    localStorage.setItem('experienciasLaborales', JSON.stringify(this.experiencias));

    // Limpiar formulario
    this.experiencia = {
      empresa: '',
      anioInicio: '',
      anioTermino: '',
      cargo: ''
    };
    this.trabajaActualmente = false;
  }
}