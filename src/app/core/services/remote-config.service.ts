import { inject, Injectable } from '@angular/core';
import { RemoteConfig, getValue, fetchAndActivate } from '@angular/fire/remote-config';

@Injectable({
  providedIn: 'root',
})
export class RemoteConfigService {
  private readonly _remoteConfig = inject(RemoteConfig);

  constructor() {
    this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      this._remoteConfig.settings.minimumFetchIntervalMillis = 10000;
      this._remoteConfig.settings.fetchTimeoutMillis = 5000;

      await fetchAndActivate(this._remoteConfig);
    } catch (error) {
      console.warn('No se pudo conectar a Remote Config:', error);
    }
  }

  getBool(key: string): boolean {
    try {
      return getValue(this._remoteConfig, key).asBoolean();
    } catch (error) {
      console.error(`Error al obtener [${key}]:`, error);
      return true;
    }
  }
}
