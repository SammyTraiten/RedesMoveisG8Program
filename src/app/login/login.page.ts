import { Component} from '@angular/core';
import { BasededadosService } from '../api/basededados.service';
import { User } from '../interfaces/user';
import { Router } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  User:User={id:0,username:"",email:"",password:"",nome:"",pais:"",kmspercorridos:0,tempomedio:0};

  constructor(private http: BasededadosService, private router: Router, private nativeStorage: NativeStorage) { }

  SignIn(email,password){
    this.http.SignIn(email,password).subscribe((data:any)=>{
      console.log(JSON.stringify(data));
      this.User=data[0];
      if (this.User==undefined){
        alert("Login errado!")
        return null;
      }else{
        //storage set para lembrar o user logged in
        //route to initiallocation

        this.nativeStorage.setItem('IdUtilizador', {property: this.User.id})
        .then(
          () => console.log('Stored item!'),
          error => console.error('Error storing item', error)
        );

        this.nativeStorage.setItem('Pais', {property: this.User.pais})
        .then(
          () => console.log('Stored item!'),
          error => console.error('Error storing item', error)
        );

        this.nativeStorage.setItem('Username', {property: this.User.username})
        .then(
          () => console.log('Stored item!'),
          error => console.error('Error storing item', error)
        );

        this.router.navigate(['/initial-location/']);
      }
    });

  }

}
