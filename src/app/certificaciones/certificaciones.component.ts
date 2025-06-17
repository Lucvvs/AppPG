import { Component, OnInit, Input } from '@angular/core';
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
import { SqliteService } from '../services/sqlite.service';

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
  @Input() datosUsuario: any = {};

  vence = false;

  certificacion = {
    nombre: '',
    fechaObtencion: '',
    fechaVencimiento: ''
  };

  certificaciones: any[] = [];

  constructor(private sqlite: SqliteService) {}

  async ngOnInit(): Promise<void> {
  console.log('📦 datosUsuario en Certificaciones:', this.datosUsuario);
  if (!this.datosUsuario?.id) return;
  await this.sqlite.asegurarConexion();
  await this.cargarCertificaciones();
}

  private async cargarCertificaciones() {
    const resultado = await this.sqlite.obtenerCertificaciones(this.datosUsuario.id);
    this.certificaciones = resultado.map(c => ({
      nombre: c.nombre,
      fechaObtencion: c.fecha_obtencion,
      fechaVencimiento: c.fecha_vencimiento || null
    }));
  }

  async agregarCertificacion() {
    console.log('🚀 Método agregarCertificacion ejecutado');

    if (!this.certificacion.nombre || !this.certificacion.fechaObtencion || !this.datosUsuario?.id) {
      console.warn('⚠️ Faltan datos obligatorios');
      return;
    }

    const nueva = {
      usuario_id: this.datosUsuario.id,
      nombre: this.certificacion.nombre.trim(),
      fecha_obtencion: this.certificacion.fechaObtencion,
      fecha_vencimiento: this.vence ? this.certificacion.fechaVencimiento : ''
    };

    await this.sqlite.asegurarConexion();
    await this.sqlite.agregarCertificacion(nueva);
    await this.cargarCertificaciones();

    console.log('✅ Certificación agregada:', nueva);

    this.certificacion = {
      nombre: '',
      fechaObtencion: '',
      fechaVencimiento: ''
    };
    this.vence = false;
  }
}