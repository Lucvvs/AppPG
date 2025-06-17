import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonList,
  IonItem,
  IonLabel,
  IonCard,
  IonCardContent,
  IonCardTitle

} from '@ionic/angular/standalone';
import { SqliteService } from '../services/sqlite.service';

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
  @Input() datosUsuario: any = {}; // viene desde perfil.page.html
  cantidadCertificaciones = 0;
  ultimaExperiencia: any = null;

  constructor(private sqlite: SqliteService) {}

  async ngOnInit(): Promise<void> {
    const userId = this.datosUsuario?.id;

    if (!userId) {
      console.warn('❌ No se encontró ID del usuario en el input');
      return;
    }

    try {
      // Certificaciones del usuario
      const certificaciones = await this.sqlite.obtenerCertificaciones(userId);
      this.cantidadCertificaciones = certificaciones.length;

      // Última experiencia laboral (última ingresada)
      const experiencias = await this.sqlite.obtenerExperiencias(userId);
      if (experiencias.length > 0) {
        const ultima = experiencias[experiencias.length - 1];
        this.ultimaExperiencia = {
          empresa: ultima.empresa,
          cargo: ultima.cargo,
          anioInicio: new Date(ultima.inicio).getFullYear(),
          anioTermino: new Date(ultima.fin).getFullYear(),
        };
      }

    } catch (error) {
      console.error('❌ Error al obtener datos desde SQLite:', error);
    }
  }
}