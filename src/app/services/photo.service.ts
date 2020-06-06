import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Storage } from '@ionic/storage';
import { ThrowStmt } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  public photos: Photo[] = [];
  constructor(private camera: Camera, private storage: Storage) {}

  takePicture(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    };
    this.camera.getPicture(options).then((ImageData) => {
      this.photos.unshift({
        data: 'data:image/jpeg;base64,' + ImageData
      });
      
      this.storage.set('photos', this.photos);

    }, (err) =>{ 
      console.log("Camera issues:"+ err);
    });
  }

  loadSaved(){
    this.storage.get('photos').then((photos) => {
      this.photos = photos || [];
    })
  }

}

class Photo {
  data: any;
}