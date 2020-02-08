import { Component, OnInit, Input,  HostListener } from '@angular/core';
import { Api } from '../../api/api'
interface Local{
  localId:string,
  userId:string,
  name:string,
  searchName:string,
  location:string,
  specific:string[],
  phone:string,
  tags:string[],
  imagesUrl:string[]
}

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class SectionComponent implements OnInit {

  private _data:Local[] = [];
  private _tag:string;
  
  get tag() : string {
    return this._tag;
  }

  @Input("tag") 
  set tag(tag:string){
    this._tag = (tag && tag.trim()) || "<no tag set>";
  }


  get data():Local[]{
    return this._data;
  }
  set data(data:Local[]){
    this._data = data || [];
  }

  constructor() { 
  }


  async ngOnInit() {
    await Api.getLocalsByTag(this._tag)
          .then(response=>{
            return response.json()
          })
          .then(data => {
            this._data = data;
          })
          .catch(err =>{
            alert(err)
          })
  }

}
