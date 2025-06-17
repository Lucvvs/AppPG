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
  IonLabel,
  IonButton
} from '@ionic/angular/standalone';
import { Location } from '@angular/common';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

// Componentes segmentados
import { MisDatosComponent } from '../mis-datos/mis-datos.component';
import { ExperienciaLaboralComponent } from '../experiencia-laboral/experiencia-laboral.component';
import { CertificacionesComponent } from '../certificaciones/certificaciones.component';
import { Router } from '@angular/router';

// Servicio SQLite
import { SqliteService } from '../services/sqlite.service';

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
    IonButton,
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
  usuario: string = '';

  constructor(
    private location: Location,
    private router: Router,
    private sqlite: SqliteService
  ) {}

  async ngOnInit() {
    // 1. Obtener nombre de usuario desde state o localStorage
    this.usuario =
      history.state?.usuario ||
      history.state?.usuarioTemporal ||
      JSON.parse(localStorage.getItem('datosUsuario') || '{}')?.usuario ||
      '';

    if (this.usuario) {
      try {
        // 2. Obtener datos completos desde SQLite
        this.datosUsuario = await this.sqlite.obtenerUsuarioPorNombre(this.usuario);
        console.log('✅ Usuario cargado desde SQLite:', this.datosUsuario);
      } catch (error) {
        console.error('❌ Error al cargar usuario desde SQLite:', error);
      }
    } else {
      console.warn('⚠️ No se encontró un usuario válido');
    }
  }

  volverAtras() {
    this.location.back();
  }

  cerrarSesion() {
    localStorage.removeItem('datosUsuario');
    history.replaceState(null, '', '/');
    this.router.navigateByUrl('/login').then(() => location.reload());
  }
}