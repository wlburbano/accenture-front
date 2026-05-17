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

  private _isCategoryManagementEnabled: WritableSignal<boolean> = signal(
    environment.remoteConfigDefaults.allowCategoryManagement,
  );

  public readonly isDescriptionEnabled: Signal<boolean> = this._isDescriptionEnabled.asReadonly();
  public readonly isCategoryManagementEnabled: Signal<boolean> =
    this._isCategoryManagementEnabled.asReadonly();

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

      const remoteCategoryValue = getValue(
        this._remoteConfig,
        'allowCategoryManagement',
      ).asBoolean();
      this._isCategoryManagementEnabled.set(remoteCategoryValue);
    } catch (error) {
      console.warn('No se pudo conectar a Remote Config Firebase:', error);
    }
  }
}
