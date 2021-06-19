import { Component } from '@angular/core';
import { BasededadosService } from '../api/basededados.service';
import { User } from '../interfaces/user';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage {

  User:User={id:0,username:"",email:"",password:"",nome:"",pais:"",kmspercorridos:0,tempomedio:0};
  id:any;
  constructor(private http: BasededadosService,private nativeStorage: NativeStorage) {
    this.nativeStorage.getItem('IdUtilizador')
    .then(
      data =>{
        this.id=data.property;
        this.getUserInfo(this.id);
      } 
    );
   }

  getUserInfo(id){
    this.http.getUser(id).subscribe((data:any)=>{
      console.log(data);
      this.User=data;
    });
  }

  updateUser(){
    this.http.putUser(this.id,this.User).subscribe((data:any)=>{
      console.log(data);
      alert("User updated!");
    });
  }

}
