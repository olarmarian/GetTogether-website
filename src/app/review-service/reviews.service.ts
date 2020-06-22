import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IReview } from 'src/utils/IReview';
import { Api } from 'src/api/api';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {

  reviews = new BehaviorSubject<IReview[]>([]);

  constructor(private http:HttpClient) { }

  async loadReviewForLocalById(id:string){
      let reviews = [];
      await Api.getReviewsByLocalId(id)
        .then(response=>{
          return response.json()
        })
        .then(data=>{
          reviews = data;
        })
        .catch(err =>{
          alert(err)
        })
        return reviews;
  }

  async getReviewsForLocalById(id:string){
    let reviewsFetched = await this.loadReviewForLocalById(id);;
    this.reviews.next(reviewsFetched);
    return this.reviews;
  }

  getAverageStarsForSpecificLocal(id:string){
    let totalStars:number = 0;
    let totalReviews:number = 0;
    let reviews = this.getReviewsForLocalById(id);
  }
  async addReview(localId:string,comment:string,stars:number){
    return await Api.postReviewForLocal(comment,localId,stars)
      .then(review =>{
        let updatedReviews = [];
        this.reviews.subscribe(res => {
          updatedReviews = res;
          updatedReviews.push(review);
          updatedReviews.sort((a,b)=>{
            if(a.createdAt > b.createdAt){
              return -1;
            }else{
              return 1
            }
          })
        })
        this.reviews.next(updatedReviews)
      })
  }
}
