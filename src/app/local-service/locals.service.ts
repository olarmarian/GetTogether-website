import { ILocal } from './../../utils/ILocal';
import { Injectable } from '@angular/core';
import { Api } from '../../api/api'
import { BehaviorSubject, Observable } from 'rxjs';

interface Filters{
  tag:string,
  specific:string
}


@Injectable({
  providedIn: 'root'
})
export class LocalsService {

  private initialLocals:ILocal[] = [];
  public locals = new BehaviorSubject<ILocal[]>(this.initialLocals);

  
  filters:Filters = {
    tag:"all",
    specific:"all"
  }
  constructor() {}

  async loadLocals(){
    await Api.getAllLocals()
      .then(data =>{
        this.locals.next(data);
      })
      .catch(err =>{
        // alert(err);
      })
  }

  async getLocals(){
    await this.loadLocals();
    return this.locals.asObservable();
  }

  async loadFilteredLocals(){

    await Api.getFilteredLocals(this.filters.tag, this.filters.specific)
    .then(data =>{
      this.locals.next(data);
    })
    .catch(err =>{
      // alert(err);
    })

  }
  
  getFilteredLocals() : Observable<ILocal[]>{
    this.loadFilteredLocals();
    
    return this.locals.asObservable();
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
        // alert(err);
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
        // alert(err)
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
    return await Api.saveLocal(local)
  }

  async updateLocal(local: ILocal){
    await Api.updateLocal(local);
  }

  async updateLocalImage(localId:string, image){
    await Api.updateLocalImage(localId, image)
  }

  async removeLocalImage(imageId: string){
    await Api.removeLocalImage(imageId)
  }
}
