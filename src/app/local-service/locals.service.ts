import { ILocal } from './../../utils/ILocal';
import { Injectable } from '@angular/core';
import { Api } from '../../api/api'
@Injectable({
  providedIn: 'root'
})
export class LocalsService {

  public locals:ILocal[] = [];
  constructor() { }

  async getLocals(){
    await Api.getAllLocals()
      .then(response =>{
        return response.json();
      })
      .then(data =>{
        this.locals=data;
      })
      .catch(err =>{
        alert(err);
      })
    return this.locals;
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

  async getAllLocalTags() {
    let tags = [];
    await Api.getAllLocalTags()
      .then(response => {
        tags = response;
      })
    return tags;
  }

  async getAllLocalSpecifics() {
    let specifics = [];
    await Api.getAllLocalSpecifics()
      .then(response => {
        specifics = response;
      })
    return specifics;
  }
  

  async saveLocal(local: any){
    await Api.saveLocal(local)
      .then(response => {
        this.locals.push(response)
      })
  }
}
