import { IReview } from './../../utils/IReview';
import { ReviewsService } from './../review-service/reviews.service';
import { Component, OnInit, Input } from '@angular/core';
@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.css']
})
export class ReviewListComponent implements OnInit {
  reviews:IReview[];

  constructor(private reviewsService:ReviewsService) { }

  @Input("localId") localId:string;
  @Input("localName") localName:string;

  ngOnInit() {
    this.reviews = [];
    this.getReviewsByLocalId();
  }

  async getReviewsByLocalId(){
    this.reviews =await this.reviewsService.getReviewsForLocalById(this.localId);
  }

  isDataLoaded():boolean{
    return this.reviews.length !== 0;
  }

}
