import { Component, OnInit, ViewChild} from '@angular/core';
import { IonSlides, IonSlide, LoadingController, ToastController } from '@ionic/angular';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
//import { Keyboard } from '@ionic-native/keyboard/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
   @ViewChild(IonSlides, {static:true}) slides: IonSlides;
   userLogin: User = {};
   userRegister: User = {};
   private loading: any;
   //public keyb: any;

  constructor( private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private authService: AuthService /*public keyboard: Keyboard*/) { }
  ngOnInit() {
  }

   segmentChanged(event: any) {
    if (event.detail.value === 'login') {
      this.slides.slidePrev();
    } else {
      this.slides.slideNext();
    }
    
  }

  async login(){
    await this.presentLoading();

    try {
      await this.authService.login(this.userLogin);
    } catch (error) {
      this.presentToast(error.message);
    } finally {
      this.loading.dismiss();
    }
  }

  async register(){
      await this.presentLoading();
      this.userRegister.isAdmin = false;
      this.userRegister.isAdminGeral = false;

    try {
      await this.authService.register(this.userRegister);
    } catch (error) {
      let message: string;
      switch (error.code) {
        case "auth/email-already-in-use":
          message = 'E-mail sendo usado!';
          break;
        case "auth/invalid-email":
          message = 'E-mail inválido!';
          break;
      }
      this.presentToast(message);
    } finally {
      this.loading.dismiss();
    }
  }

  async presentLoading(){
    this.loading = await this.loadingCtrl.create({
      message:'Por favor, aguarde...'
    });
    return this.loading.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }
}
