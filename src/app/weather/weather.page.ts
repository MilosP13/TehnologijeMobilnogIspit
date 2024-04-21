import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

const API_URL = environment.API_URL;
const API_KEY = environment.API_KEY;

interface WeatherResponse {
  main: {
    temp: number; // Example: temperature in Kelvin
    // Define other properties as needed (e.g., humidity, pressure, etc.)
  };
  weather:{
    icon: string,
    description: string;
  }
}

@Component({
  selector: 'app-weather',
  templateUrl: './weather.page.html',
  styleUrls: ['./weather.page.scss'],
})
export class WeatherPage implements OnInit {
  weatherTemp: any;
  weatherIcon: any;
  weatherDetails: any;
  todayDate = new Date();
  cityName = "Belgrade";
  constructor(private navCtrl: NavController,
    public httpClient:HttpClient) { 
      this.loadData();
    }

  ngOnInit() { }

  goBack() {
    this.navCtrl.back(); // This will navigate back to the previous page
  }


  

  loadData(){
    this.httpClient.get<WeatherResponse>(`${API_URL}/weather?q=${"Belgrade"}&appid=${API_KEY}`).subscribe(results =>{
      
      this.weatherTemp = results.main; 
      
      this.weatherDetails = results.weather;
      console.log(results.weather.description)
      
      this.weatherIcon = `https://openweathermap.org/img/wn/04n@4x.png`;
    });
  }


}
