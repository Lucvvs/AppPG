import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonList, IonItem, IonLabel, IonInput, IonCheckbox, IonButton,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  AlertController
} from '@ionic/angular/standalone';
import { SqliteService } from '../services/sqlite.service';

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
  @Input() datosUsuario: any = {};

  trabajaActualmente = false;

  experiencia = {
    empresa: '',
    anioInicio: '',
    anioTermino: '',
    cargo: ''
  };

  experiencias: any[] = [];

  constructor(
    private sqlite: SqliteService,
    private alertCtrl: AlertController
  ) {}

  async ngOnInit(): Promise<void> {
    if (!this.datosUsuario?.id) return;

    await this.sqlite.asegurarConexion(); // por si se rompe al recargar
    await this.cargarExperiencias();
  }

  private async cargarExperiencias() {
    try {
      const datos = await this.sqlite.obtenerExperiencias(this.datosUsuario.id);
      this.experiencias = datos.map(exp => ({
        empresa: exp.empresa,
        cargo: exp.cargo,
        anioInicio: new Date(exp.inicio).getFullYear(),
        anioTermino: exp.fin ? new Date(exp.fin).getFullYear() : 'Actualidad'
      }));
    } catch (error) {
      console.error('❌ Error al cargar experienciias:', error);
    }
  }

  async agregarExperiencia() {
  if (!this.datosUsuario?.id) return;

  const nuevaExp = {
    usuario_id: this.datosUsuario.id,
    empresa: this.experiencia.empresa.trim(),
    cargo: this.experiencia.cargo.trim(),
    inicio: `${this.experiencia.anioInicio}-01-01`,
    fin: this.trabajaActualmente
      ? ''
      : `${this.experiencia.anioTermino}-12-31`
  };

  try {
    await this.sqlite.asegurarConexion();
    await this.sqlite.agregarExperiencia(nuevaExp);
    await this.cargarExperiencias();

    console.log('✅ Experiencia agregada:', nuevaExp);

  } catch (error) {
    console.error('❌ Error al guardar experiencia:', error);
  }

  // Limpiar 
  this.experiencia = {
    empresa: '',
    anioInicio: '',
    anioTermino: '',
    cargo: ''
  };
  this.trabajaActualmente = false;
}
}