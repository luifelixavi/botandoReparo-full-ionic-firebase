import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { DadosComponent } from './components/dados/dados.component';

import { Keyboard } from '@ionic-native/keyboard/ngx';

import { Camera } from '@ionic-native/camera/ngx';

import { File } from '@ionic-native/file/ngx';


@NgModule({
  declarations: [AppComponent, DadosComponent],
  entryComponents: [DadosComponent],
  imports: [BrowserModule,
   IonicModule.forRoot(), 
   AppRoutingModule, 
   AngularFireModule.initializeApp(environment.firebase), 
   AngularFireStorageModule,
   AngularFireAuthModule,
    AngularFirestoreModule],
  providers: [
    Keyboard,
    StatusBar,
    SplashScreen,
    Camera,
    File,
    
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
