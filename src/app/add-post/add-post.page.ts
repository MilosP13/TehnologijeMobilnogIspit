import { Component, OnInit } from '@angular/core';
import { Post } from "../models/post.model";
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.page.html',
  styleUrls: ['./add-post.page.scss'],
})
export class AddPostPage implements OnInit {
post = {} as Post;

  constructor(private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private firestore: AngularFirestore
    ) { }

  ngOnInit() { }

  goBack() {
    this.navCtrl.back(); // This will navigate back to the previous page
  }

  async createPost(post: Post){
    if(this.formValidation()){
      //loader
      let loader = this.loadingCtrl.create({
        message:"Please wait..."
      });
      (await loader).present();
      try{
        
        await this.firestore.collection("posts").add(post);

      }catch(e){
        this.showToast("Error accured");
      }

      //dissmiss loader
    (await loader).dismiss();
    }


    // to home page
    this.navCtrl.navigateRoot("home");

  }

  formValidation(){
    if(!this.post.title){
      this.showToast("Error accured");
      return false;
    }

    if(!this.post.details){
      this.showToast("Error accured");
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
