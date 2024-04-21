import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { DataServiceService } from '../data-service.service';

@Component({
  selector: 'app-heart',
  templateUrl: './heart.page.html',
  styleUrls: ['./heart.page.scss'],
})
export class HeartPage implements OnInit {

  heartRate: number | null = null;
  heartRates: any[] = []; 
  isSaved: boolean = false;
 
  constructor(private navCtrl: NavController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private firestore: AngularFirestore,
    private firebaseService: DataServiceService) { }

  ngOnInit() {
    this.measureHeartRate();
  }

  measureHeartRate() {
    
    setTimeout(() => {
      // Generate a random fake heart rate value between 60 and 100 bpm
      this.heartRate = Math.floor(Math.random() * (100 - 60 + 1)) + 60;
    }, 5000); // Display after 5 seconds
  }

  measureAgain() {
    this.heartRate = null; 
    this.heartRates = []; 
    this.isSaved = false;
    this.measureHeartRate(); 
  }

  goBack() {
    this.navCtrl.back(); // This will navigate back to the previous page
  }

  saveHeartRate() {
    if (!this.isSaved && this.heartRate !== null) {
      this.firebaseService.saveHeartRate(this.heartRate)
        .then(() => {
          console.log('Heart rate saved successfully');
          this.showToast("Heart rate saved successfully");
          // Optionally, you can add a toast or notification to indicate successful save
          this.isSaved = true; // Set isSaved to true after saving
        })
        .catch((error) => {
          console.error('Error saving heart rate: ', error);
          this.showToast('Error saving heart rate: ');
          // Optionally, you can add a toast or notification to indicate error
        });
    }
  }

  showHeartRates() {
    this.firebaseService.getAllHeartRates().subscribe((heartRates: any[]) => {
      this.heartRates = heartRates;
    });
  }

  showToast(message: string){
    this.toastCtrl.create({
      message: message,
      duration: 3000
    }).then(toastData => toastData.present())
  }

}
