import { inject, Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly _toastCtrl = inject(ToastController);

  async presentToast(
    message: string,
    color: 'success' | 'danger' | 'warning' | 'primary' = 'success',
    position: 'bottom' | 'top' | 'middle' = 'bottom',
  ): Promise<void> {
    const toast = await this._toastCtrl.create({
      message,
      duration: 2000,
      position,
      color,
      buttons: [
        {
          text: 'X',
          role: 'cancel',
        },
      ],
    });
    await toast.present();
  }
}
