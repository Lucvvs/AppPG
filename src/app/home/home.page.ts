import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
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

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    // Core
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,

    // Angular Material
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
    private alertCtrl: AlertController,
    private router: Router,
    private location: Location
    
  ) {
    this.usuario = history.state?.usuario || 'Usuario';

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

  // uppear primera letra
  const capitalizar = (texto: string) =>
    texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();

  // Datos 
  const datosCompletos = {
    usuario: this.usuario,
    nombre: capitalizar(nombre),
    apellido: capitalizar(apellido),
    fechaNacimiento: new Date(fechaNacimiento).toLocaleDateString(),
    educacion,
    contrasena: '****' 
  };

  const alert = await this.alertCtrl.create({
    header: this.usuario,
    cssClass: 'custom-alert',
    message: `Su nombre es: "${datosCompletos.nombre} ${datosCompletos.apellido}"\ny nació el: "${datosCompletos.fechaNacimiento}".`,
    buttons: [
      { text: 'Dato incorrecto', role: 'cancel' },
      {
        text: 'Confirmar',
        handler: () => {
          localStorage.setItem('datosUsuario', JSON.stringify(datosCompletos));
          this.router.navigate(['/perfil']);
        }
      }
    ]
  });

  await alert.present();
}

volverAtras() {
  this.location.back();
}
}