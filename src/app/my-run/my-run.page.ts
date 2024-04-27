import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { DataServiceService } from '../data-service.service';

@Component({
  selector: 'app-my-run',
  templateUrl: './my-run.page.html',
  styleUrls: ['./my-run.page.scss'],
})
export class MyRunPage implements OnInit {

  routeS: any[] = []; 

  constructor(private navCtrl: NavController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private firestore: AngularFirestore,
    private firebaseService: DataServiceService) { }

  ngOnInit() {
    this.showRoutes();
  }

  showRoutes() {
    this.firebaseService.getAllRoutes().subscribe((routeS: any[]) => {
      this.routeS = routeS;
    });
  }

  showToast(message: string){
    this.toastCtrl.create({
      message: message,
      duration: 3000
    }).then(toastData => toastData.present())
  }

  goBack() {
    this.navCtrl.back(); // This will navigate back to the previous page
  }

}
