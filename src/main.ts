import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { SqliteService } from './app/services/sqlite.service';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

(async () => {
  try {
    const appRef = await bootstrapApplication(AppComponent, {
      providers: [
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        provideIonicAngular(),
        provideRouter(routes, withPreloading(PreloadAllModules)),
        SQLite,
        SqliteService
      ]
    });

    const injector = appRef.injector;
    const sqliteService = injector.get(SqliteService);
    await sqliteService.initDB(); // 👈 espera que la BD esté lista ANTES de todo

    console.log('🟢 SQLite inicializado correctamente al inicio');

  } catch (err) {
    console.error('❌ Error al iniciar la app:', err);
  }
})();