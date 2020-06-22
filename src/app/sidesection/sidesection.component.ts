import { Component, OnInit, Input } from '@angular/core';
import {ILocal } from 'src/utils/ILocal';
import {Api} from '../../api/api'
@Component({
  selector: 'app-sidesection',
  templateUrl: './sidesection.component.html',
  styleUrls: ['./sidesection.component.css']
})
export class SidesectionComponent implements OnInit {

  public _title:string;
  private _data:ILocal[] = [];
  @Input("title") titleInput:string

  constructor() { }

  async ngOnInit() {
    this._title = this.titleInput;
    if(this._title === "THE MOST POPULAR"){
        await Api.getTheMostPopular()
          .then(response=>{
            return response.json()
          })
          .then(data => {
            this._data = data;
          })
          .catch(err =>{
            // alert(err)
          })
      }
      else if(this._title === "THE BIGGEST RATE"){
        await Api.getTheBiggestRate()
          .then(response=>{
            return response.json()
          })
          .then(data =>{
            this._data = data;
          })
          .catch(err =>{
            // alert(err)
          })
      }else if(this._title === "THE NEWEST"){
        await Api.getTheNewest()
          .then(response=>{
            return response.json()
          })
          .then(data =>{
            this._data = data;
          })
          .catch(err =>{
            // alert(err)
          })
      }
  }

  get title():string{
    return this._title;
  }
  set title(title: string){
    this._title = title;
  }

  get data():ILocal[]{
    return this._data;
  }

  set data(data:ILocal[]){
    this._data = data;
  }
}
