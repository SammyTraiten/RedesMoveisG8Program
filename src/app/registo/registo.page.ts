import { Component} from '@angular/core';
import { BasededadosService } from '../api/basededados.service';
import { User } from '../interfaces/user';
import { Router } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Component({
  selector: 'app-registo',
  templateUrl: './registo.page.html',
  styleUrls: ['./registo.page.scss'],
})
export class RegistoPage{

  allusers:any;
  Try:boolean;
  User:User={id:0,username:"",email:"",password:"",nome:"",pais:"",kmspercorridos:0,tempomedio:0};

  constructor(private http: BasededadosService, private router: Router,private nativeStorage: NativeStorage) {
    this.getallusers();
  }

  TestSignUp(){ 
    
    this.Try=this.emailIsValid(this.User.email);
      
      if(this.User.password=="" || this.User.nome=="" || this.User.email=="" || this.Try==false || this.User.username=="" || this.User.pais==""){
        alert("Os campos não foram todos preenchidos corretamente.");
      }else{
        if(!this.compare()){
          alert("O campo email ou username já existem");
        }else{
          this.SignUp();
        }
        
      }

  }

  getallusers(){
    this.http.getallusers().subscribe((data:any)=>{
      console.log(data);
      this.allusers=data;
    });
  }

  compare(){
    for(var i=0;i<this.allusers.length;i++){
      if(this.allusers[i].email==this.User.email || this.User.username==this.allusers[i].username){
        return false;
      }
    }
    return true;
  }

  emailIsValid (email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  SignUp(){

    this.http.SignupUser(this.User).subscribe((data:any)=>{
      console.log(data);
      alert("Registado com sucesso!");

      this.nativeStorage.setItem('IdUtilizador', {property: data.id})
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

      this.router.navigate(['/initial-location']);

    });

  }

}
