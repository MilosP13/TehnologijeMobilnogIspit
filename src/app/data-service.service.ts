import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  constructor(private firestore: AngularFirestore) { }

  saveHeartRate(heartRate: number): Promise<any> {
    return this.firestore.collection('heartRates').add({
      value: heartRate,
      timestamp: new Date().toISOString()
    });
  }

   // Method to get all heart rates from Firebase
   getAllHeartRates(): Observable<any[]> {
    return this.firestore.collection('heartRates').valueChanges();
  }

}
