import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { RemoteConfig, getValue, fetchAndActivate } from '@angular/fire/remote-config';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RemoteConfigService {
  private readonly _remoteConfig = inject(RemoteConfig);

  private _isDescriptionEnabled: WritableSignal<boolean> = signal(
    environment.remoteConfigDefaults.allowTaskDescription,
  );

  public readonly isDescriptionEnabled: Signal<boolean> = this._isDescriptionEnabled.asReadonly();

  constructor() {
    this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      this._remoteConfig.defaultConfig = environment.remoteConfigDefaults;
      this._remoteConfig.settings.minimumFetchIntervalMillis = 10000;
      this._remoteConfig.settings.fetchTimeoutMillis = 5000;

      await fetchAndActivate(this._remoteConfig);

      const remoteValue = getValue(this._remoteConfig, 'allowTaskDescription').asBoolean();
      this._isDescriptionEnabled.set(remoteValue);
    } catch (error) {
      console.warn('No se pudo conectar a Remote Config Firebase:', error);
    }
  }
}
