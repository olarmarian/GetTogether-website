import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IReview } from 'src/utils/IReview';
import { Api } from 'src/api/api';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {

  reviews:IReview[] = [];
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
    this.reviews = [];
    this.reviews =await this.loadReviewForLocalById(id);
    return this.reviews;
  }

  getAverageStarsForSpecificLocal(id:string){
    let totalStars:number = 0;
    let totalReviews:number = 0;
    let reviews = this.getReviewsForLocalById(id);
  }
  async addReview(localId:string,comment:string,stars:number){
    console.log(comment)
    return await Api.postReviewForLocal(comment,localId,stars)
      .then(review =>{
        this.reviews.push(review);
        this.reviews.sort((a,b)=>{
          if(a.createdAt > b.createdAt){
            return -1;
          }else{
            return 1
          }
        })
      })
  }
}
