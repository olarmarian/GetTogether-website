import { IReview } from './../../utils/IReview';
import { ReviewsService } from './../review-service/reviews.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.css']
})
export class ReviewListComponent implements OnInit {
  reviews:IReview[] = [];
  reviewsPage: IReview[] = [];

  startIndex: number = 0;
  endIndex: number = 5;
  chunkOfReviews: number = 5;
  limitPage: number = 5;
  constructor(
    private reviewsService:ReviewsService) { }

  @Input("localId") localId:string;
  @Input("localName") localName:string;

  ngOnInit() {
    this.reviews = [];
    this.getReviewsByLocalId();
  }

  async getReviewsByLocalId(){
    this.reviews =await this.reviewsService.getReviewsForLocalById(this.localId);
    this.reviewsPage = this.reviews.slice(this.startIndex, this.endIndex);
  }

  isDataLoaded():boolean{
    return this.reviews.length !== 0;
  }
  onPageChanged(event){
    const prevPageIndex = event.previousPageIndex;
    const pageIndex = event.pageIndex;
    
    if(prevPageIndex < pageIndex){
      this.startIndex = this.endIndex;
      if(this.endIndex + this.chunkOfReviews > this.reviews.length){
        this.endIndex = this.reviews.length;
      }else{
        this.endIndex + this.chunkOfReviews;
      }
    }
    else if(prevPageIndex > pageIndex){
      this.endIndex = this.startIndex;
      this.startIndex -= this.chunkOfReviews;
    }
    this.reviewsPage = this.reviews.slice(this.startIndex, this.endIndex);
  }
}
