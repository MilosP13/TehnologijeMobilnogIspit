import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.mode';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
user = {} as User;
  constructor(private toastCtrl: ToastController, 
    private loadingCtrl: LoadingController,
    private afAuth: AngularFireAuth,
    private navCtrl: NavController
    ) { }

  ngOnInit() {
  }

  goBack() {
    this.navCtrl.back(); // This will navigate back to the previous page
  }

  async register(user: User){
    if(this.formValidation()){
      // show loader
      let loader = this.loadingCtrl.create({
        message: "Please wait..."
      });
      (await loader).present();

      try {
        await this.afAuth.createUserWithEmailAndPassword(user.email, user.password)
        .then(data => {
          console.log(data);

          //redirect to home page
          this.navCtrl.navigateRoot("login");
        })
      }catch(e){
        this.showToast("Error: Enter real e-mail adress");
      }

      //dismis loader
      (await loader).dismiss();
    }
  }  


  formValidation(){
    if(!this.user.email){
      this.showToast("Enter email");
      return false;
    }

    if(!this.user.password){
      this.showToast("Enter password");
      return false;
    }

    return true;
  }


  showToast(message: string){
    this.toastCtrl.create({
      message: message,
      duration: 3000
    }).then(toastData => toastData.present())
  }
}
