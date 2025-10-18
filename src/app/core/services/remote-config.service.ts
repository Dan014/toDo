import { Injectable } from '@angular/core';
import { getRemoteConfig, fetchAndActivate, getBoolean, RemoteConfig } from 'firebase/remote-config';
import { getApp } from 'firebase/app';

@Injectable({ providedIn: 'root' })
export class RemoteConfigService {
  private remoteConfig: RemoteConfig;

  constructor() {
    this.remoteConfig = getRemoteConfig(getApp());
    this.remoteConfig.settings.minimumFetchIntervalMillis = 10000; // 10s para pruebas
  }

  async initialize(): Promise<void> {
    await fetchAndActivate(this.remoteConfig);
  }

  getFeatureFlag(flagName: string): boolean {
    return getBoolean(this.remoteConfig, flagName);
  }
}
