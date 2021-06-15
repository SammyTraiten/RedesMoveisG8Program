import { Component } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { BasededadosService } from '../api/basededados.service';
import { Mensagem } from '../interfaces/mensagem';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage {
  mensagens:any;
  mensagemE:Mensagem={id:0,iduti:0,username:"",pais:"", mensagem:""};
  id:any;
  pais:any;
  constructor(private http: BasededadosService, private nativeStorage : NativeStorage) { 
    this.nativeStorage.getItem('Username')
      .then(
        data =>{
          this.nativeStorage.getItem('Pais')
            .then(
              datadois =>{
                this.nativeStorage.getItem('IdUtilizador')
                  .then(
                    datatres =>{
                      this.id=datatres.property;
                      this.pais=datadois.property;
                      this.mensagemE.username=data.property;
                      this.mensagemE.pais=datadois.property;
                      this.mensagemE.iduti=datatres.property; 
                      this.getallmensagens();
                    });
              });          
        });
       
        setInterval(()=> {
          this.getallmensagens(); },5000); 
  }

  submitmensagem(mensagem){
          this.mensagemE.mensagem=mensagem;
          this.http.addmessage(this.mensagemE).subscribe((data:any)=>{
            console.log(data);
        });
  }

  getallmensagens(){
    this.http.getallmessages().subscribe((data:any)=>{
      console.log(data);
      this.mensagens=data;
    });
  }

}
