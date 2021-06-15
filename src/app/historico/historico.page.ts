import { Component } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { BasededadosService } from '../api/basededados.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.page.html',
  styleUrls: ['./historico.page.scss'],
})
export class HistoricoPage {
  id:any;
  pesquisas:any;

  constructor(private nativeStorage: NativeStorage, private http: BasededadosService,private router: Router) { 
    this.nativeStorage.getItem('IdUtilizador')
    .then(
      data =>{
        this.id=data.property;
        this.getHistory(this.id);
      } 
    );
  }

  getHistory(id){
    this.http.GetUserDestiny(id).subscribe((data:any) =>{
      this.pesquisas=data;
    });
  }

  remove(pesquisa){
    console.log(pesquisa.id);
    this.http.removeDestiny(pesquisa.id).subscribe((data:any)=>{
      console.log(data);
    });
    window.location.reload();
  }

}
