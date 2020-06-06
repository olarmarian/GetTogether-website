import { Injectable } from '@angular/core';
import { Api } from '../../api/api'
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  jwtToken : string;
  constructor(private http:HttpClient) {
  }

  login(username:string, password:string){
    return this.http.post(Api.getUsersUrl()+'/login',{email:username,password})
  }

  signUp(name:string,phone:string,email:string,password:string,confirmedPassword:string){
    return Api.signUp(name,phone,email,password,confirmedPassword)
  }

  getAccount(userId:string){
    return Api.getAccount(userId);
  }

  getUserLocal(userEmail:string){
    return Api.getUserLocal(userEmail);
  }

  getReservationHistory(userId:string){
    return Api.getReservationHistory(userId);
  }

  setSession(token:string,userId:string){
    if(token!==undefined ||token!==null ){
      sessionStorage.setItem('token',token);
      sessionStorage.setItem('userId',userId);
      sessionStorage.setItem('expires_in',(new Date().getMilliseconds()+60000).toString());
      sessionStorage.setItem('start_session', new Date().getMilliseconds().toString())
    }
  }

  isLoggedIn(){
    return sessionStorage.getItem('token') !== null;
  }


  logout(){
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('expires_in');
  }
}
