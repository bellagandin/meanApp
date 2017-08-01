import { User } from '../shared/User';
import { Injectable } from '@angular/core';
import {Http,Headers} from '@angular/http';
import {AppConfig} from '../shared/AppConfig';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthenticateService {
  authToken: any;
  user: any;


  constructor(private http: Http) { }



  registerUser(user){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(AppConfig.API_ENDPOINT+'users/register',user,{headers: headers})
      .map(res=>res.json());
  }
  autheniticate(user){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(AppConfig.API_ENDPOINT+'users/authenticate',user,{headers: headers})
      .map(res=>res.json());
  }
  storeUserData(token,user){
    localStorage.setItem('id_token',token);
    localStorage.setItem('user',JSON.stringify(user));
    this.authToken=token;
    this.user=user;
  }
  logout(){
    this.authToken=null;
    this.user=null;
    localStorage.clear();
  }

}
