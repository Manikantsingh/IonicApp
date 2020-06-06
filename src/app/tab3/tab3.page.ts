import { Component } from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  bluetooth: boolean;
  value: string;
  constructor(public ble: BLE ,public plt: Platform) {
  }

  ngOnInit(){
    this.bluetooth = false;
  }



  toggleBT(){
    if(this.bluetooth){
      this.ble.enable().then(()=>{
        this.bluetooth = true;
      },(err)=>{  
        this.bluetooth = false;
      }) 
      
    }else{
      this.value = "BLE plugin does not provide option to disable the bluetooth"
    }
  }

}
