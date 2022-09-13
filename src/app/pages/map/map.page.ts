import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Platform,NavController, LoadingController,  ToastController } from '@ionic/angular';
import { PointService } from 'src/app/services/point.service';
import { Point } from 'src/app/interfaces/point';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

import { PopoverController } from '@ionic/angular';
import { DadosComponent } from '../../components/dados/dados.component';

import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  GoogleMapsAnimation,
  MyLocation,
  CameraPosition,
  MarkerOptions,
  MarkerCluster,
  Marker,
  HtmlInfoWindow,
  Environment
} from '@ionic-native/google-maps';

@Component({
  selector: 'app-map',
  templateUrl: 'map.page.html',
  styleUrls: ['map.page.scss'],
})
export class MapPage implements OnInit{
	@ViewChild('map',{static:true}) mapElement: any;
	private loading: any;
  public user: any = {};
  private userSubscription: Subscription;
	private map: GoogleMap;
  private pointId: string = null;
  public point: Point = {};
   public points = new Array<Point>();
  private pointSubscription: Subscription;

  constructor(
  	private platform: Platform,
  	private loadingCtrl: LoadingController,
    private pointService: PointService,
    private toastCtrl: ToastController,
    private authService: AuthService,
    private navCtrl: NavController,
    public popoverController: PopoverController
  	) {
      this.pointSubscription = this.pointService.getPoints().subscribe(data => {
      this.points = data;
      console.log("Contructor");
      console.log(this.points);
      this.loadMap();
    });

  }

 
    addCluster(data) {
    let markerCluster: MarkerCluster = this.map.addMarkerClusterSync({
      markers: data,
      icons: [
        {
          min: 3,
          max: 9,
          url: "./assets/markercluster/small.png",
          label: {
            color: "white"
          }
        },
        {
          min: 10,
          url: "./assets/markercluster/large.png",
          label: {
            color: "white"
          }
        }
      ]
    });

    markerCluster.on(GoogleMapsEvent.MARKER_CLICK).subscribe((params) => {
      let marker: Marker = params[1];
      this.notifications(marker.get("nome"),marker.get("description"),marker.get("telefone"),marker.get("whats"), marker.get("endereco"), marker.get("atendimento"), marker.get("biografia"),marker.get("servicos").split(','));
    });

  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  ngOnInit(){
  	this.mapElement.nativeElement;
  }

  async loadMap(){
  	this.loading = await this.loadingCtrl.create({message: 'Por Favor Aguarde ...'});
  	await this.loading.present();

  	// This code is necessary for browser
    Environment.setEnv({
      'API_KEY_FOR_BROWSER_RELEASE': 'AIzaSyAJuF4YAV4xWwTr2xlgdcubaNd4kx8sH6c',
      'API_KEY_FOR_BROWSER_DEBUG': 'AIzaSyAJuF4YAV4xWwTr2xlgdcubaNd4kx8sH6c'
    });

    const mapOptions: GoogleMapOptions = {
     	controls:{
     		zoom: true
     	}
    };

    this.map = GoogleMaps.create('map', mapOptions);

    try{
    	await this.map.one(GoogleMapsEvent.MAP_READY);

    	this.addOriginMarker();
      this.addCluster(this.points);
      this.loading.dismiss();
    } catch(error){
      	console.error(error);
    }
  }

 async addOriginMarker(){
 	try{
 		const myLocation: MyLocation = await this.map.getMyLocation();
 		await this.map.moveCamera({
 			target: myLocation.latLng,
 			zoom: 17
 		});

 		this.map.addMarkerSync({
 			title: 'Origem',
 			icon: '#000',
 			animation: GoogleMapsAnimation.DROP,
 			position: myLocation.latLng
 		});
 	}catch(error){
 		console.error(error);
 	}
 }

async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: 'Aguarde...' });
    return this.loading.present();
  }

   async notifications(nome: string, description: string,telefone: string,whats: string, endereco: string, atendimento: string, biografia: string, servicos: string) {
    const popover = await this.popoverController.create({
        component: DadosComponent,
        animated: true,
        showBackdrop: true,
        componentProps: {
            nome: nome,
           biografia: biografia,
           servicos: servicos,
           description: description,
           telefone: telefone,
           whats: whats,
           endereco: endereco,
           atendimento: atendimento
        }
    });
    return await popover.present();
  }

async deleteProduct(id: string) {
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
