import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';

import { PointService } from 'src/app/services/point.service';
import { Point } from 'src/app/interfaces/point';

import { Position } from 'src/app/interfaces/position';

import { Camera } from '@ionic-native/camera/ngx';

import { File } from '@ionic-native/file/ngx';

import {
 	Geocoder,
  LocationService,
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  GoogleMapsAnimation,
  MyLocation,
  CameraPosition,
  MarkerOptions,
  Marker,
  Environment
} from '@ionic-native/google-maps';

declare var google: any;

@Component({
  selector: 'app-point-details',
  templateUrl: './point-details.page.html',
  styleUrls: ['./point-details.page.scss'],
})
export class PointDetailsPage implements OnInit {
  private loading: any;
  
  private pointId: string = null;
  public point: Point = {};
  public position: Position = {};
  private pointSubscription: Subscription;

  private map: GoogleMap;
  private googleAutocomplete = new google.maps.places.AutocompleteService();
  public searchResults = new Array<any>();
  public search: string = '';
  private end: any;
  private localizacao: any;
  public endereco: string = "";

  constructor(
    private pointService: PointService,
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private ngZone: NgZone,
    private camera: Camera
  ) {

    this.pointId = this.activatedRoute.snapshot.params['id'];

    if (this.pointId) this.loadPoint();
  }

  ngOnInit() { }

/*  openGalery(){
    const options: CameraOptions = {
      quality:100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      correctOrientation:true
    };
  }*/

  ngOnDestroy() {
      if (this.pointSubscription) this.pointSubscription.unsubscribe();
  }

  async selectEndereco(item: any){
    this.end = item;
    this.search = '';

    const info: any = await Geocoder.geocode({address: this.end.description});
    this.position = info.position;
    this.endereco = this.end.description; 
  }

  searchChanged(){
    if(!this.search.trim().length) return;

    this.googleAutocomplete.getPlacePredictions({input: this.search}, predictions=> {
      this.ngZone.run(() =>{
        this.searchResults = predictions;
      });      
    });
  }

  loadPoint() {
    this.pointSubscription = this.pointService.getPoint(this.pointId).subscribe(data => {
      this.point = data;
    });
  }

  
 async savePoint() {
    await this.presentLoading();

    this.map = GoogleMaps.create('map');
    this.point.position = {};

    this.point.userId = this.authService.getAuth().currentUser.uid;
    const myLocation: MyLocation = await this.map.getMyLocation();
    this.point.position.lat = myLocation.latLng.lat;
    this.point.position.lng = myLocation.latLng.lng;
    this.point.createdAt = new Date().getTime();
    this.point.endereco = this.endereco;
    this.point.icon = "assets/markercluster/marker.png";

      if (this.pointId) {
      try {
        await this.pointService.updatePoint(this.pointId, this.point);
        await this.loading.dismiss();

        this.navCtrl.navigateBack('/home');
      } catch (error) {
        this.presentToast('Erro ao tentar salvar');
        this.loading.dismiss();
      }
    } else {
      this.point.createdAt = new Date().getTime();

      try {
        await this.pointService.addPoint(this.point,this.point.userId);
        await this.loading.dismiss();

        this.navCtrl.navigateBack('/home');
      } catch (error) {
        this.presentToast('Erro ao tentar salvar');
        this.loading.dismiss();
      }
    }
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: 'Aguarde...' });
    return this.loading.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }
}