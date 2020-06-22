import { ReviewsService } from './../review-service/reviews.service';
import { LocalsService } from './../local-service/locals.service';
import { ILocal } from './../../utils/ILocal';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-locals-page',
  templateUrl: './locals-page.component.html',
  styleUrls: ['./locals-page.component.css']
})

export class LocalsPageComponent implements OnInit {

  locals:ILocal[] = [];
  tags:string[] = [];
  specifics:string[] = [];
  stars:string[] = ['1','2','3','4','5']
  filteredList:ILocal[] = [];
  subscription;

  constructor(private localsService:LocalsService, private reviewsService:ReviewsService) { }

  ngOnInit() {
    this.setup();
  }

  setup(){
    this.localsService.getMetadataForLocals().then(metadata => {
      this.tags = metadata.tags;
      this.specifics = metadata.specifics;
    });

    this.subscription = this.localsService
      .getFilteredLocals()
      .subscribe(res => {
        this.locals = res;
      }, err =>{
        console.error(err)
      });
  }
}
