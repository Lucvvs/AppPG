import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonInput, IonItem, IonLabel } from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonInput,
    IonItem,
    IonLabel,
    CommonModule,
    FormsModule
  ]
})
export class LoginPage implements OnInit {

  correo: string = '';
  contrasena: string = '';

  constructor() { }

  ngOnInit() {}

  login() {
    console.log('Correo:', this.correo);
    console.log('Contraseña:', this.contrasena);
    alert('Mi primera app :)');
  }
}