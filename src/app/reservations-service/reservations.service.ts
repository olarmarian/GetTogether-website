import { Injectable } from '@angular/core';
import { Api } from '../../api/api'

@Injectable({
  providedIn: 'root'
})
export class ReservationsService {

  constructor() { }

  async saveReservation(reservation) {
    return await Api.saveReservation(reservation)
  }

  async getLocalsReservations(localId: string){
    return await Api.getLocalsReservations(localId)
  }

  async updateReservation(reservation){
    return await Api.updateReservation(reservation);
  }

  async updateStatusReservation(reservation){
    return await Api.updateStatusReservation(reservation);
  }

  async getReservationHistory(userId:string){
    return await Api.getReservationHistory(userId)
  }

  async getActiveReservations(userId:string){
    return await Api.getActiveReservations(userId)
  }

}
