import { Component, OnInit } from '@angular/core';
import { Post } from '../models/post.model';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.page.html',
  styleUrls: ['./edit-post.page.scss'],
})
export class EditPostPage implements OnInit {
post = {} as Post;
id: any;


  constructor(private actRoute: ActivatedRoute,private loadingCtrl: LoadingController,private firestore: AngularFirestore, private toastCtrl: ToastController,
    private navCtrl: NavController) { 
    this.id  = this.actRoute.snapshot.paramMap.get("id");
  }

  ngOnInit() {
    this.getPostById(this.id);
  }


  // OVO CE DA PRAVI PROBLEM
  async getPostById(id: string){
    // show loader
    let loader = await this.loadingCtrl.create({
     message: "Please wait..."
   });
   loader.present();

   this.firestore
     .doc("posts/" + id)
     .valueChanges()
     .subscribe((data: any) => { // Explicitly type 'data' as 'any' or create a custom interface/type
       if (data) {
         this.post.title = data.title;
         this.post.details = data.details;

         // dismiss loader
         loader.dismiss();
       } else {
         // Handle case where no data is returned
         console.error("No data found for the specified ID");
         // Dismiss loader in case of error
         loader.dismiss();
       }
     });
 }




  async updatePost(post: Post){
    if(this.formValidation()){
       //loader
       let loader = this.loadingCtrl.create({
        message:"Please wait..."
      });
      (await loader).present();

      try{

        await this.firestore.doc("posts/" + this.id).update(post);

      }catch(e){
        this.showToast("Error accured");
      }

      //dissmiss loader
      (await loader).dismiss();

      // to home page
      this.navCtrl.navigateRoot("home");
    }
  }




  formValidation(){
    if(!this.post.title){
      this.showToast("Edit Task First");
      return false;
    }

    if(!this.post.details){
      this.showToast("Edit Details");
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
