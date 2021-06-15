import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen, 
    private statusBar: StatusBar,
    private nativeStorage: NativeStorage
  ) {this.initializeApp();}

  initializeApp(){
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  onLogout(){
    this.nativeStorage.remove('IdUtilizador')
    .then(
      data => console.log(data),
      error => console.error(error)
    );

    this.nativeStorage.remove('Username')
    .then(
      data => console.log(data),
      error => console.error(error)
    );

    this.nativeStorage.remove('Pais')
    .then(
      data => console.log(data),
      error => console.error(error)
    );

  }

}
