import { ReviewsService } from './../review-service/reviews.service';
import { LocalsService } from './../local-service/locals.service';
import { ILocal } from './../../utils/ILocal';
import { Component, OnInit } from '@angular/core';


interface Filters{
  tag:string,
  stars:number,
  specific:string
}

@Component({
  selector: 'app-locals-page',
  templateUrl: './locals-page.component.html',
  styleUrls: ['./locals-page.component.css']
})

export class LocalsPageComponent implements OnInit {

  filters:Filters = {
    tag:null,
    stars:null,
    specific:null
  }

  locals:ILocal[] = [];
  tags:string[] = [];
  specifics:string[] = [];
  stars:string[] = ['1','2','3','4','5']
  filteredList:ILocal[] = [];
  constructor(private localsService:LocalsService, private reviewsService:ReviewsService) { }

  ngOnInit() {
    this.setup();
  }

  setup(){
    this.localsService.getMetadataForLocals().then(metadata => {
      metadata.tags.forEach(x=>{
        this.tags.push(x)
      })
      this.specifics = metadata.specifics;
    });
    this.localsService.getLocals().then(result => {this.locals = result, this.filteredList = this.locals});
  }

  private containsTag(local:ILocal,tag:string):boolean{
    return this.filters.tag===null ? true: local.tags.filter(localTag=>{
      return localTag===("#"+tag)
    }).length>0
  }
  private containsSpecific(local:ILocal,specific:string):boolean{
    return this.filters.specific===null ? true: local.specific.filter(localSpecific=>{
      return localSpecific===specific
    }).length>0
  }
  private isStarsFilterHigherOrEqualToAverage(local:ILocal,stars:number):boolean{
    let averageStars = 0;
    this.reviewsService.getReviewsForLocalById(local.localId).then(result => {
      console.log(result);
    });
    return this.filters.stars===null ? true : averageStars >= stars;
  }

  applyFilters(){
    this.filteredList = this.locals.filter(local=>{
      return this.containsTag(local,this.filters.tag) || this.containsSpecific(local,this.filters.specific) || this.isStarsFilterHigherOrEqualToAverage(local,this.filters.stars)
    })
  }

  setTag(tag:string){
    this.filters.tag = tag;
  }

  setStart(stars:number){
    this.filters.stars = stars;
  }

  setSpecific(specific:string){
    this.filters.specific = specific;
  }

}
