import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root',
})
export class SqliteService {
  private sqlite: SQLiteConnection;
  private db!: SQLiteDBConnection;
  private dbName = 'formativa.db';
  private initialized = false;

  constructor() {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
  }

  //  Inicializar bdd
  async initDB(): Promise<void> {
    try {
      if (this.initialized) return;

      const existing = await this.sqlite.isConnection(this.dbName, false);
      if (existing.result) {
        await this.sqlite.closeConnection(this.dbName, false);
      }

      if (Capacitor.getPlatform() !== 'web') {
        try {
          await this.sqlite.checkConnectionsConsistency();
          await this.sqlite.copyFromAssets();
          console.log('📦 copyFromAssets ejecutado');
        } catch (e) {
          console.warn('⚠️ copyFromAssets falló (probablemente sin archivo preexistente):', e);
        }
      }

      this.db = await this.sqlite.createConnection(this.dbName, false, 'no-encryption', 1, false);
      await this.db.open();
      await this.createTables();

      const existe = await this.obtenerUsuarioPorNombre('Tomate');
      console.log('👀 Usuario Tomate existe?', existe);

      if (!existe) {
        await this.insertarUsuario({
          usuario: 'Test',
          contrasena: '1234',
          nombre: 'Test',
          apellido: 'User',
          nivel_educacional: 'Media',
          fecha_nacimiento: '2000-01-01'
        });
        console.log('✅ Usuario Tomate insertado desde initDB');
      }

      this.initialized = true;
      console.log('✅ Base de datos SQLite lista');
    } catch (err) {
      console.error('❌ Error al inicializar DB:', err);
    }
  }

  private async createTables(): Promise<void> {
    const createUsuario = `
      CREATE TABLE IF NOT EXISTS usuario (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario TEXT NOT NULL UNIQUE,
        contrasena TEXT NOT NULL,
        nombre TEXT,
        apellido TEXT,
        nivel_educacional TEXT,
        fecha_nacimiento TEXT
      );
    `;

    const createExperiencia = `
      CREATE TABLE IF NOT EXISTS experiencia (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER,
        empresa TEXT,
        cargo TEXT,
        inicio TEXT,
        fin TEXT,
        FOREIGN KEY (usuario_id) REFERENCES usuario(id)
      );
    `;

    const createCertificacion = `
      CREATE TABLE IF NOT EXISTS certificacion (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER,
        nombre TEXT,
        fecha_obtencion TEXT,
        fecha_vencimiento TEXT,
        FOREIGN KEY (usuario_id) REFERENCES usuario(id)
      );
    `;

    await this.db.execute(createUsuario);
    await this.db.execute(createExperiencia);
    await this.db.execute(createCertificacion);
  }

  async asegurarConexion(): Promise<void> {
    if (!this.db || !(await this.dbIsOpen())) {
      console.warn('🔁 Reintentando conexión a SQLite...');
      await this.initDB();
    }
  }

  private async dbIsOpen(): Promise<boolean> {
    try {
      await this.db?.query('SELECT 1;');
      return true;
    } catch (error) {
      console.warn('❌ dbIsOpen falló:', error);
      return false;
    }
  }

 
  // USUARIOS
  // ============================
  async insertarUsuario(data: {
    usuario: string;
    contrasena: string;
    nombre?: string;
    apellido?: string;
    nivel_educacional?: string;
    fecha_nacimiento?: string;
  }): Promise<void> {
    const sql = `
      INSERT INTO usuario (usuario, contrasena, nombre, apellido, nivel_educacional, fecha_nacimiento)
      VALUES (?, ?, ?, ?, ?, ?);
    `;
    const values = [
      data.usuario,
      data.contrasena,
      data.nombre || '',
      data.apellido || '',
      data.nivel_educacional || '',
      data.fecha_nacimiento || '',
    ];
    await this.db.run(sql, values);
  }

  async obtenerUsuarioPorNombre(usuario: string): Promise<any | null> {
    const sql = `SELECT * FROM usuario WHERE usuario = ?;`;
    const result = await this.db.query(sql, [usuario]);
    return result.values?.length ? result.values[0] : null;
  }

  
  // EXPERIENCIA
  // ============================
  async agregarExperiencia(data: {
    usuario_id: number;
    empresa: string;
    cargo: string;
    inicio: string;
    fin: string;
  }): Promise<void> {
    const sql = `
      INSERT INTO experiencia (usuario_id, empresa, cargo, inicio, fin)
      VALUES (?, ?, ?, ?, ?);
    `;
    await this.db.run(sql, [
      data.usuario_id,
      data.empresa,
      data.cargo,
      data.inicio,
      data.fin,
    ]);
  }

  async obtenerExperiencias(usuario_id: number): Promise<any[]> {
    const sql = `SELECT * FROM experiencia WHERE usuario_id = ?;`;
    const result = await this.db.query(sql, [usuario_id]);
    return result.values || [];
  }

  
  // CERTIFICACIONES
  // ============================
  async agregarCertificacion(data: {
    usuario_id: number;
    nombre: string;
    fecha_obtencion: string;
    fecha_vencimiento: string;
  }): Promise<void> {
    const sql = `
      INSERT INTO certificacion (usuario_id, nombre, fecha_obtencion, fecha_vencimiento)
      VALUES (?, ?, ?, ?);
    `;
    await this.db.run(sql, [
      data.usuario_id,
      data.nombre,
      data.fecha_obtencion,
      data.fecha_vencimiento,
    ]);
  }

  async obtenerCertificaciones(usuario_id: number): Promise<any[]> {
    const sql = `SELECT * FROM certificacion WHERE usuario_id = ?;`;
    const result = await this.db.query(sql, [usuario_id]);
    return result.values || [];
  }
}