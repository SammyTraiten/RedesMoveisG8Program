import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BasededadosService {

  constructor(private http: HttpClient) { }

  SignupUser(User){
    return this.http.post("http://xxx.xxx.x.xx:3000/Users",User);
  }

  SignIn(email,password){
    return this.http.get("http://xxx.xxx.x.xx:3000/Users?email="+email+"&password="+password);
  }

  getUser(id){
    return this.http.get("http://xxx.xxx.x.xx:3000/Users/"+id);
  }

  putUser(id,User){
    return this.http.put("http://xxx.xxx.x.xx:3000/Users/"+id,User)
  }

  RegistDestiny(Destino){
    return this.http.post("http://xxx.xxx.x.xx:3000/SearchHistory",Destino);
  }

  GetUserDestiny(id){
    return this.http.get("http://xxx.xxx.x.xx:3000/SearchHistory?idutilizador="+id);
  }
 
  removeDestiny(id){
    return this.http.delete("http://xxx.xxx.x.xx:3000/SearchHistory/"+id);
  }

  addmessage(message){
    return this.http.post("http://xxx.xxx.x.xx:3000/Chat",message);
  }

  getallmessages(){
    return this.http.get("http://xxx.xxx.x.xx:3000/Chat");
  }

  getallusers(){
    return this.http.get("http://xxx.xxx.x.xx:3000/Users");
  }
}
