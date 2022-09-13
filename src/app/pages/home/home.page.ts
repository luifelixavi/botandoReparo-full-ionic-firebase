import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingController, ToastController,NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { PointService } from 'src/app/services/point.service';
import { Point } from 'src/app/interfaces/point';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  private loading: any;
  public user: any = {};
  public points = new Array<Point>();
  private pointsSubscription: Subscription;
  private userSubscription: Subscription;


  constructor(
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private pointService: PointService,
    private toastCtrl: ToastController
  ) {
    this.pointsSubscription = this.pointService.getPointsUsers(this.authService.getAuth().currentUser.uid).subscribe(data => {
      this.points = data;
    });
    this.userSubscription = this.authService.getUser(this.authService.getAuth().currentUser.uid).subscribe(data => {
        this.user = data;
    });
    

  }


  ngOnInit() { }

  ngOnDestroy() {
    this.pointsSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  async logout() {
    await this.presentLoading();

    try {
      await this.authService.logout();
      this.navCtrl.navigateBack('/map');
    } catch (error) {
      console.error(error);
    } finally {
      this.loading.dismiss();
    }
    
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: 'Aguarde...' });
    return this.loading.present();
  }

  async deletePoint(id: string) {
    try {
      await this.pointService.deletePoint(id);
    } catch (error) {
      this.presentToast('Erro ao tentar deletar');
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }
}