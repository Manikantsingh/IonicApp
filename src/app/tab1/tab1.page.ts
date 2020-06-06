import { Component, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage'
import { NavController, Platform } from '@ionic/angular';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { MediaCapture, MediaFile, CaptureError,CaptureVideoOptions } from '@ionic-native/media-capture/ngx'
import { File } from '@ionic-native/file/ngx';

const MEDIA_FILES_KEY = 'mediaFiles';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  mediaFiles: any[] = [];
  @ViewChild('myvideo',{static: false}) myVideo: any;
  recording: boolean = false;
  filePath: string;
  fileName: string;
  audio: MediaObject;
  video: MediaFile;
  audioList: any[] = [];

  constructor(public navCtrl: NavController,
    private media: Media,
    private file: File,
    public platform: Platform,
    private storage: Storage,
    public mediaCapture: MediaCapture) {}

    ionViewDidLoad() {
      this.storage.get(MEDIA_FILES_KEY).then(res => {
        this.mediaFiles = JSON.parse(res) || [];
      })
    }
   
    captureAudio() {
      this.mediaCapture.captureAudio().then(res => {
        this.storeMediaFiles(res);
      }, (err: CaptureError) => console.error(err));
    }
   
    captureVideo() {
      let options: CaptureVideoOptions = {
        limit: 1,
        duration: 30
      }
      this.mediaCapture.captureVideo(options).then((res: MediaFile[]) => {
        let capturedFile = res[0];
        let fileName = capturedFile.name;
        let dir = capturedFile['localURL'].split('/');
        dir.pop();
        let fromDirectory = dir.join('/');      
        var toDirectory = this.file.dataDirectory;
        
        this.file.copyFile(fromDirectory , fileName , toDirectory , fileName).then((res) => {
          this.storeMediaFiles([{name: fileName, size: capturedFile.size}]);
        },err => {
          console.log('err: ', err);
        });
            },
      (err: CaptureError) => console.error(err));
    }
   
    play(myFile) {
      if (myFile.name.indexOf('.wav') > -1) {
        const audioFile: MediaObject = this.media.create(myFile.localURL);
        audioFile.play();
      } else {
        let path = this.file.dataDirectory + myFile.name;
        let url = path.replace(/^file:\/\//, '');
        let video = this.myVideo.nativeElement;
        video.src = url;
        video.play();
      }
    }
   
    storeMediaFiles(files) {
      this.storage.get(MEDIA_FILES_KEY).then(res => {
        if (res) {
          let arr = JSON.parse(res);
          arr = arr.concat(files);
          this.storage.set(MEDIA_FILES_KEY, JSON.stringify(arr));
        } else {
          this.storage.set(MEDIA_FILES_KEY, JSON.stringify(files))
        }
        this.mediaFiles = this.mediaFiles.concat(files);
      })
    }


    ionViewWillEnter() {
      this.getAudioList();
    }

    getAudioList() {
      if(localStorage.getItem("audiolist")) {
        this.audioList = JSON.parse(localStorage.getItem("audiolist"));
        console.log(this.audioList);
      }
    }


    startRecord() {
      if (this.platform.is('ios')) {
        this.fileName = 'record'+new Date().getDate()+new Date().getMonth()+new Date().getFullYear()+new Date().getHours()+new Date().getMinutes()+new Date().getSeconds()+'.3gp';
        this.filePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + this.fileName;
        this.audio = this.media.create(this.filePath);
      } else if (this.platform.is('android')) {
        this.fileName = 'record'+new Date().getDate()+new Date().getMonth()+new Date().getFullYear()+new Date().getHours()+new Date().getMinutes()+new Date().getSeconds()+'.3gp';
        this.filePath = this.file.externalDataDirectory.replace(/file:\/\//g, '') + this.fileName;
        this.audio = this.media.create(this.filePath);
      }
      this.audio.startRecord();
      this.recording = true;
    }

    stopRecord() {
      this.audio.stopRecord();
      let data = { filename: this.fileName };
      this.audioList.push(data);
      localStorage.setItem("audiolist", JSON.stringify(this.audioList));
      this.recording = false;
      this.getAudioList();
    }

    playAudio(file,idx) {
      if (this.platform.is('ios')) {
        this.filePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + file;
        this.audio = this.media.create(this.filePath);
      } else if (this.platform.is('android')) {
        console.log("starting audio file : " , file);
        this.filePath = this.file.externalDataDirectory.replace(/file:\/\//g, '') + file;
        this.audio = this.media.create(this.filePath);
      }
      this.audio.play();
      this.audio.setVolume(0.8);
    }
    

    clearAll(i){
      let oldlist = JSON.parse(localStorage["audiolist"]);
      console.log("oldlist ", oldlist);
      oldlist.splice(i,1);
      localStorage.setItem("audiolist", JSON.stringify(oldlist));
      let newlist= localStorage.getItem("audiolist");
      console.log("newlist ", newlist);
      this.getAudioList();
    
    }


   
}