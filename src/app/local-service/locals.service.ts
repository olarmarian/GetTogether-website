import { ILocal } from './../../utils/ILocal';
import { Injectable } from '@angular/core';
import { Api } from '../../api/api'
import { Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LocalsService {

  constructor() { }

  async getLocals(){
    let locals:ILocal[] = [];
    await Api.getAllLocals()
      .then(response =>{
        return response.json();
      })
      .then(data =>{
        locals=data;
      })
      .catch(err =>{
        alert(err);
      })
    return locals;
  }

  async getLocalByName(name:string){
    let local;
    await Api.getLocalByName(name)
      .then(response=>{
        return response.json();
      })
      .then(data=>{
        local=data[0];
      })
      .catch(err =>{
        alert(err);
      })
      return local;
  }

  async getMetadataForLocals(){
    let metadata;
    await Api.getMetadataForLocals()
      .then(response => {
        return response.json();
      })
      .then(data => {
        metadata = data;
      })
      .catch(err => {
        alert(err)
      })
    return metadata;
  }
}
