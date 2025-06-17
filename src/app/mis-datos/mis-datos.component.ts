import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
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
export class MisDatosComponent implements OnChanges {
  @Input() datosUsuario: any = {};
  cantidadCertificaciones = 0;
  ultimaExperiencia: any = null;

  constructor(private sqlite: SqliteService) {}

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['datosUsuario'] && this.datosUsuario?.id) {
      const userId = this.datosUsuario.id;
      console.log(' ID del usuario recibido en MisDatos:', userId);

      try {
        // Certificaciones
        const certificaciones = await this.sqlite.obtenerCertificaciones(userId);
        this.cantidadCertificaciones = certificaciones.length;
        console.log(` Certificaciones cargadas (${certificaciones.length}):`, certificaciones);

        // Experiencia
        const experiencias = await this.sqlite.obtenerExperiencias(userId);
        console.log(` Experiencias cargadas (${experiencias.length}):`, experiencias);

        if (experiencias.length > 0) {
          const ultima = experiencias[experiencias.length - 1];
          this.ultimaExperiencia = {
            empresa: ultima.empresa,
            cargo: ultima.cargo,
            anioInicio: new Date(ultima.inicio).getFullYear(),
            anioTermino: new Date(ultima.fin).getFullYear(),
          };
          console.log('✅ Última experiencia procesada:', this.ultimaExperiencia);
        } else {
          console.log('ℹEl usuario no tiene experiencias registradas');
        }

      } catch (error) {
        console.error('❌ Error al cargar datos en MisDatosComponent:', error);
      }
    } else {
      console.warn(' No se recibió ID válido del usuario en MisDatosComponent');
    }
  }
}