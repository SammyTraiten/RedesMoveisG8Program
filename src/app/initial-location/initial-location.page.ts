import { Component,ViewChild, ElementRef, NgZone } from '@angular/core';
import { Plugins, ActionSheetOptionStyle } from '@capacitor/core';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { BasededadosService } from '../api/basededados.service';
import { Search } from '../interfaces/search';
import { HTTP } from '@ionic-native/http/ngx';
import { User } from '../interfaces/user';
import { ThrowStmt } from '@angular/compiler';

const { Modals } = Plugins;
const {Geolocation}= Plugins;

declare var google: any;

@Component({
  selector: 'app-initial-location',
  templateUrl: './initial-location.page.html',
  styleUrls: ['./initial-location.page.scss'],
})
export class InitialLocationPage{
  polyanterior: any=null;
  markeranterior: any=null;
  map: any;
  Latitude:any;
  Longitude:any;
  location:any;
  marker: any;
  markerdestiny:any;
  infoWindows: any=[];
  placeid: any;
  autocomplete: {input: string;};
  autocompleteItems: any[];
  GoogleAutocomplete:any;
  condition:any;
  title:any;
  poly:any;
  now:any;
  travelmode:any="driving";
  search:Search={id:0,idutilizador:0,origem:"",destino:"",kms:0,tempo:0,data:""};
  User:User={id:0,username:"",email:"",password:"",nome:"",pais:"",kmspercorridos:0,tempomedio:0};
  id:any;

  @ViewChild( 'map', {read: ElementRef, static:false}) mapRef:ElementRef;

  constructor(public zone: NgZone, private nativeGeocoder: NativeGeocoder,private nativeStorage: NativeStorage,private http: BasededadosService,private httpdois: HTTP) {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
  }

  ionViewDidEnter(){
    this.nativeStorage.getItem('IdUtilizador')
    .then(
      data =>{
        this.id=data.property;
        this.getUser(this.id);
      } 
    );
    this.getLocation();
  }

  //melhorar
  //https://developers.google.com/maps/documentation/places/web-service/search
  //https://developers.google.com/maps/documentation/places/web-service/supported_types type= n sei como fazer esta parte atualmente devolve qualquer sitio, talvez um array
  notificationplace(){
    var num=Math.floor(Math.random()*(19-0+1)+0);
    console.log(num);
    this.httpdois.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+this.marker.latitude+","+this.marker.longitude+"&radius=5000&key=AIzaSyBRPKwjmlLZlVg6GQwBRRAwb6x0qC-bCBc",{},{}).then((data:any)=>{
      var obj=JSON.parse(data.data);
      let Infoalert =  Modals.confirm({
        title: 'Place to Visit:',
        message: "Name: "+obj.results[num].name+
        "\nLatitude: "+obj.results[num].geometry.location.lat+
        "\nLongitude: "+obj.results[num].geometry.location.lng

      });
      console.log('Infoalert', Infoalert);
    });
  }

  getUser(id){
    this.http.getUser(id).subscribe((data:any)=>{
      console.log(data);
      this.User=data[0];
    });
  }

  //pega as cordenadas atuais do atualizador
  async getLocation(){
    const coordinates = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
    this.Latitude=coordinates.coords.latitude;
    this.Longitude=coordinates.coords.longitude;
    console.log("Current Location:", coordinates);

    this.location = new google.maps.LatLng(this.Latitude, this.Longitude);
     let options: NativeGeocoderOptions = {
       useLocale: true,
       maxResults: 5
    };
    
    this.nativeGeocoder.reverseGeocode(this.Latitude, this.Longitude, options).then((result: NativeGeocoderResult[]) =>{
      this.title=result[0].thoroughfare+ ", " + result[0].locality + ", " + result[0].administrativeArea + ", " + result[0].countryName;
      console.log("Title:",this.title)
      this.marker={
        title: this.title,
        latitude:this.Latitude,
        longitude:this.Longitude
      }
      this.notificationplace();
      this.showMap();
    })
      .catch((error: any) => console.log(error));

  }

  //geração do Mapa
  showMap(){
      const options =  {
        center: this.location,
        zoom: 12,
        zoomControl:false
      }
      this.map = new google.maps.Map(this.mapRef.nativeElement, options);
      //this.directionsRenderer.setMap(this.map);
      //console.log("Renderer:",this.directionsRenderer);
      this.addMarkerHereToMap(this.marker);
      
  }

  //adiciona o marcador da posição atual do utilizador
  addMarkerHereToMap(marker){
    let position=new google.maps.LatLng(marker.latitude,marker.longitude);
    let mapMarker=new google.maps.Marker({
      position: position,
      title: marker.title,
      latitude: marker.latitude,
      longitude: marker.longitude,
      icon: '/assets/markerHere.png'
    });
    
    mapMarker.setMap(this.map);
    this.addInfowindowToMarker(mapMarker);
  }

  //adiciona o marcador de destino
  addMarkersDestinyToMap(marker){
    let position=new google.maps.LatLng(marker.latitude,marker.longitude);
    if(this.markeranterior!=null){
      this.markeranterior.setMap(null);
    }
    let mapMarker=new google.maps.Marker({
      position: position,
      title: marker.title,
      latitude: marker.latitude,
      longitude: marker.longitude,
      icon: '/assets/markerDestiny.png'
    });
    
    this.markeranterior=mapMarker;
    mapMarker.setMap(this.map);
    this.addInfowindowToDestinyMarker(mapMarker);
  }

  addInfowindowToMarker(marker){
    let infoWindowContent= '<div id="content">' +
      '<h4 id= "firstHeading" class"firstHeading">' + marker.title + '</h4>' +
      '<p>Latitude:' + marker.latitude + '</p>' +
      '<p>Longitude:' + marker.longitude + '</p>' +
      '</div>'

      let infoWindow= new google.maps.InfoWindow({
        content: infoWindowContent
      });

      marker.addListener('click', ()=>{
        this.closeAllInfoWindows();
        infoWindow.open(this.map,marker);
      });
      
      this.infoWindows.push(infoWindow);
  }

  addInfowindowToDestinyMarker(marker){
    let infoWindowContent= '<div id="content">' +
      '<h4>' + marker.title + '</h4>' +
      '<p>Latitude:' + marker.latitude + '</p>' +
      '<p>Longitude:' + marker.longitude + '</p>' +
      '<ion-button id="info">Information</ion-button>'+
      '<ion-button id="navigate">Navigate</ion-button>'+
      '</div>'

      let infoWindow= new google.maps.InfoWindow({
        content: infoWindowContent
      });

      marker.addListener('click', ()=>{
        this.closeAllInfoWindows();
        infoWindow.open(this.map,marker);
      });

      google.maps.event.addListenerOnce(infoWindow, 'domready', ()=>{
        document.getElementById('navigate').addEventListener('click',()=>{
          window.open('https://www.google.com/maps/dir/?api=1&destination='+this.markerdestiny.latitude+ ',' + this.markerdestiny.longitude); 
          this.addtouser();
        });
      });

      google.maps.event.addListenerOnce(infoWindow, 'domready', ()=>{
        document.getElementById('info').addEventListener('click',()=>{
          this.Information();
        });
      });

      this.infoWindows.push(infoWindow);
      this.Polyline();
       //chamar base de dados
       this.getinfodois();
  }

  closeAllInfoWindows(){
    for(let window of this.infoWindows){
      window.close();
    }
  }

   
  UpdateSearch(){
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
    (predictions, status) => {
      this.autocompleteItems = [];
      this.zone.run(() => {
        predictions.forEach((prediction) => {
          this.autocompleteItems.push(prediction);
        });
      });
    });
  }

  SelectSearch(item){
    console.log("Search:",item);    
    this.placeid = item.place_id;
    this.autocompleteItems = [];
    
    //Transform adress in lat,long
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };

    this.nativeGeocoder.forwardGeocode(item.description, options).then((result: NativeGeocoderResult[]) => {
      this.markerdestiny={
        title: item.description,
        latitude: result[0].latitude,
        longitude: result[0].longitude
    }
      console.log('The coordinates are latitude=' + result[0].latitude + ' and longitude=' + result[0].longitude);
      console.log("Marker:",this.markerdestiny);
      this.addMarkersDestinyToMap(this.markerdestiny);

    })
    .catch((error: any) => console.log(error));

  }

  ClearSearch(){
    this.autocompleteItems = []
    this.autocomplete.input = ''

  }

  Polyline(){
    if(this.polyanterior!=null){
      this.polyanterior.setMap(null);
    }
    this.poly = new google.maps.Polyline({
      path:[new google.maps.LatLng(this.marker.latitude,this.marker.longitude),
        new google.maps.LatLng(this.markerdestiny.latitude,this.markerdestiny.longitude)],
      strokeColor: "#FF0000",
      geodesic: true,
      strokeOpacity: 1.0,
      strokeWeight: 3,
    });
    this.polyanterior=this.poly;
    console.log("Poly:",JSON.stringify(this.poly));
    this.poly.setMap(this.map);
  }
  
  //melhorar
  Information(){
    this.httpdois.get("https://maps.googleapis.com/maps/api/distancematrix/json?origins="+this.marker.latitude+","+this.marker.longitude+"&destinations="+this.markerdestiny.latitude+","+this.markerdestiny.longitude+"&mode="+this.travelmode+"&key=AIzaSyBRPKwjmlLZlVg6GQwBRRAwb6x0qC-bCBc", {},{}).then((data:any)=>{
      var obj=JSON.parse(data.data);
      if(obj.rows[0].elements[0].status=="OK"){
        let Infoalert =  Modals.confirm({
          title: 'Information',
          message: 'Origem:'+obj.origin_addresses+'\nDestino:'+obj.destination_addresses+'\nDistancia:'+(obj.rows[0].elements[0].distance.value/1000).toFixed(2)+'km \nDuracao:'+(obj.rows[0].elements[0].duration.value/3600).toFixed(2)+'h'
        });
        console.log('Infoalert', Infoalert);
      }
    });
  }

  getinfodois(){
    this.httpdois.get("https://maps.googleapis.com/maps/api/distancematrix/json?origins="+this.marker.latitude+","+this.marker.longitude+"&destinations="+this.markerdestiny.latitude+","+this.markerdestiny.longitude+"&mode="+this.travelmode+"&key=AIzaSyBRPKwjmlLZlVg6GQwBRRAwb6x0qC-bCBc", {},{}).then((data:any)=>{
      var obj=JSON.parse(data.data);
      if(obj.rows[0].elements[0].status=="OK"){
        this.search.origem=obj.origin_addresses;
        this.search.destino=obj.destination_addresses;
        this.search.kms=Math.round((obj.rows[0].elements[0].distance.value/1000)*100)/100;
        this.search.tempo=Math.round((obj.rows[0].elements[0].duration.value/3600)*100)/100;
        this.addhistory();
      }
    });
  }

  addhistory(){
    this.nativeStorage.getItem('IdUtilizador')
      .then(
        data =>{
         this.now=new Date();
         this.search.idutilizador=data.property;
         this.search.data=this.now.getDate()+","+(this.now.getMonth()+1)+","+this.now.getFullYear();
         this.http.RegistDestiny(this.search).subscribe((data:any) =>{
          console.log("History Registed",data);
        });
        } 
      );
  }

  addtouser(){
        this.User.kmspercorridos=Math.round((this.User.kmspercorridos + this.search.kms)*100)/100;
        this.User.tempomedio=Math.round((this.User.tempomedio + this.search.tempo)*100)/100;
        this.http.putUser(this.User.id,this.User).subscribe((data:any)=>{
          console.log(data);
        });
  }

  async showActions() {
    let promptRet = await Modals.showActions({
      title: 'Transportation',
      message: 'Choose your way of transportation:',
      options: [
        {
          title: 'Bicycling'
        },
        {
          title: 'Driving'
        },
        {
          title: 'Walking',
          style: ActionSheetOptionStyle.Default
        }
      ]
    })
    
    if(promptRet.index==0){
      this.travelmode='bicycling';
      alert("Bicycling only appears information if there are bicycling roads in the route.")
    }else if(promptRet.index==1){
      this.travelmode='driving';
    }else if(promptRet.index==2){
      this.travelmode='walking';
    }

    console.log('You selected', this.travelmode);
   
  }

}



