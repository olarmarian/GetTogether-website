import { Injectable } from '@angular/core';
import { Api } from '../../api/api'
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  jwtToken : string;
  constructor(private http:HttpClient) {
  }

  login(username:string, password:string){
    return this.http.post(Api.getUsersUrl()+'/login',{email:username,password})
  }

  signUp(name:string,phone:string,email:string,password:string,confirmedPassword:string){
    return Api.signUp(name,phone,email,password,confirmedPassword)
  }

  setSession(token:string){
    if(token!==undefined ||token!==null ){
      localStorage.setItem('token',token);
      localStorage.setItem('expires_in',(new Date().getMilliseconds()+60000).toString());
      localStorage.setItem('start_session', new Date().getMilliseconds().toString())
    }
  }

  isLoggedIn(){
    return localStorage.getItem('token') !== null;
  }


  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('expores_in');
  }
}
