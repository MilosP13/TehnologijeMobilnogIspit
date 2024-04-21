import { Component } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { ToastController, LoadingController, Platform, NavController } from "@ionic/angular";
import { QueryDocumentSnapshot } from 'firebase/firestore';
import { Subscription } from 'rxjs';


@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage {
  posts: { id: string; title: string; details: string }[] = [];
  subscription: any;

  constructor(
    private toastCtrl: ToastController,
    private firestore: AngularFirestore,
    private loadingCtrl: LoadingController,
    private platform: Platform,
    private navCtrl: NavController
  ) {}

  logout() {
    this.navCtrl.navigateRoot('/login'); // This will navigate back to the previous page
  }

  ionViewDidEnter() {
    
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  async getPosts() {
    // console.log("get posts");

    // show loader
    let loader = await this.loadingCtrl.create({
      message: "Please wait..."
    });
    loader.present();

    try {
      this.subscription = this.firestore
        .collection("posts")
        .snapshotChanges()
        .subscribe(data => {
          this.posts = data.map(e => {
            const postData = e.payload.doc.data() as { title: string, details: string };
            const id = e.payload.doc.id;

            return { id, ...postData };
          });
        });
        (await loader).dismiss();
    } catch (e) {
      this.showToast("error");
    }

  }

  async deletePost(id: string) {
    // console.log(id);

    // show loader
    let loader = await this.loadingCtrl.create({
      message: "Please wait..."
    });
    loader.present();

    await this.firestore.doc("posts/" + id).delete();

    // dismiss loader
    loader.dismiss();
  }

  ionViewWillEnter() {
    this.getPosts();
  }

  showToast(message: string) {
    this.toastCtrl
      .create({
        message: message,
        duration: 3000
      })
      .then(toastData => toastData.present());
  }
}