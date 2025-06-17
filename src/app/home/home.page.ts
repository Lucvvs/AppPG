import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
// Servicio SQLite
import { SqliteService } from '../services/sqlite.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule
  ],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  usuario: string = '';
  form: FormGroup;

  nivelesEducacion: string[] = [
    'Básica',
    'Media',
    'Técnico Superior',
    'Universitaria',
    'Prefiero no informar'
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private sqlite: SqliteService
  ) {
    console.log('🧠 Datos que llegaron a Home:', history.state);
    this.usuario = history.state?.usuario || history.state?.usuarioTemporal || 'Usuario';

    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      educacion: ['', Validators.required],
      fechaNacimiento: ['', Validators.required]
    });
  }

  limpiar() {
    this.form.reset();
  }

  async mostrarDatos() {
    const { nombre, apellido, fechaNacimiento, educacion } = this.form.value;

    const capitalizar = (texto: string) =>
      texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();

    const fechaFormateada = fechaNacimiento
      ? new Date(fechaNacimiento).toISOString().substring(0, 10)
      : '';

    const datosCompletos = {
      usuario: this.usuario,
      nombre: capitalizar(nombre),
      apellido: capitalizar(apellido),
      fechaNacimiento: fechaFormateada,
      nivel_educacional: educacion,
      contrasena: '1234'
    };

    // ⚠️ Verifica si ya existe antes de insertar
    const existente = await this.sqlite.obtenerUsuarioPorNombre(this.usuario);
    if (!existente) {
      await this.sqlite.insertarUsuario(datosCompletos);
    }

    localStorage.setItem('datosUsuario', JSON.stringify(datosCompletos));

    // ✅ Redirigir al perfil con el usuario
    this.router.navigate(['/perfil'], {
      state: { usuario: this.usuario }
    });
  }

  volverAtras() {
    this.location.back();
  }
}