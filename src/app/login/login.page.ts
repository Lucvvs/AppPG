import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { SqliteService } from '../services/sqlite.service';

// Angular Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, AfterViewInit {
  loginForm: FormGroup;
  mensajeError: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private location: Location,
    private sqlite: SqliteService
  ) {
    this.loginForm = this.fb.group({
      usuario: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(8)]],
      contrasena: ['', [Validators.required, Validators.pattern(/^[0-9]{4}$/)]],
    });
  }

  async ngOnInit() {
    await this.sqlite.asegurarConexion();

    const existente = await this.sqlite.obtenerUsuarioPorNombre('Tomate');
    if (!existente) {
      await this.sqlite.insertarUsuario({
        usuario: 'Tomate',
        contrasena: '1234',
        nombre: 'Test',
        apellido: 'User',
        nivel_educacional: 'Media',
        fecha_nacimiento: '2000-01-01'
      });
    }

    this.loginForm.reset();
    this.mensajeError = '';
  }

  async login() {
  this.mensajeError = '';

  if (this.loginForm.invalid) {
    this.mensajeError = 'Completa correctamente el formulario.';
    return;
  }

  const { usuario, contrasena } = this.loginForm.value;

  try {
    await this.sqlite.asegurarConexion();
    const user = await this.sqlite.obtenerUsuarioPorNombre(usuario);

    if (!user) {
      // Usuario no existe registro
      this.router.navigate(['/home'], {
        state: {
          usuarioTemporal: usuario,
          contrasenaTemporal: contrasena
        }
      });
      return;
    }

    if (user.contrasena !== contrasena) {
      // Usuario  clave incorrecta 
      this.mensajeError = 'La contraseña es incorrecta.';
      return;
    }

    //  Usuario y contraseña correctosw
    this.router.navigate(['/perfil'], {
      state: { usuario: user.usuario }
    });

  } catch (error) {
    console.error('❌ Error en login():', error);
    this.mensajeError = 'Error al conectar con la base de datos.';
  }
}

  volverAtras() {
    this.location.back();
  }

  ngAfterViewInit() {
    const texto = 'donde todo comienza';
    const destino = document.getElementById('maquina-texto');
    const cursor = document.querySelector('.cursor');

    if (!destino || !cursor) return;

    let i = 0;
    function escribir() {
      if (!destino) return;
      if (i < texto.length) {
        destino.textContent += texto.charAt(i);
        i++;
        setTimeout(escribir, 150);
      } else {
        setTimeout(() => {
          if (cursor) cursor.classList.add('oculto');
        }, 2000);
      }
    }

    escribir();
  }
}