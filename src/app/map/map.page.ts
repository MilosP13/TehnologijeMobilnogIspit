import { Component, ViewChild, ElementRef } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { DataServiceService } from '../data-service.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage {
  @ViewChild('map', { static: false }) mapElement!: ElementRef;
  routeInfo: string = '';
  private map!: L.Map;
  private routingControl!: L.Routing.Control;
  private markerIcon = L.icon({
    iconUrl: 'assets/map-marker.png',
    iconSize: [32, 50],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  route: String | null = null;
  routeS: any[] = []; 
  isSaved: boolean = false;

  constructor(private navCtrl: NavController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private firestore: AngularFirestore,
    private firebaseService: DataServiceService) {}

  ionViewDidEnter() {
    this.initMap();
    this.fetchPollutionData();
  }

  private initMap(): void {
    if (this.mapElement) {
      // Initialize the map
      this.map = L.map(this.mapElement.nativeElement).setView([51.505, -0.09], 13);

      // Add tile layer to the map
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: 'Leaflet | OpenStreetMap contributors',
      }).addTo(this.map);

      // Get user's current location
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const userLocation = L.latLng(latitude, longitude);

        // Update the map view to user's location
        this.map.setView(userLocation, 13);

        // Add custom marker at user's location
        L.marker(userLocation, { icon: this.markerIcon }).addTo(this.map)
          .bindPopup('Your Location').openPopup();

        // Initialize routing control with user's location as start point
        this.initRoutingControl(userLocation);
      }, (error) => {
        console.error('Error getting user location:', error);
      });
    } else {
      console.error('Map element not found!');
    }

  }

  private initRoutingControl(startPoint: L.LatLng): void {
    const lineOptions = {
      styles: [{ color: '#00FF00', opacity: 0.7 }],
      extendToWaypoints: true,
      missingRouteTolerance: 100,
    };
  
    this.routingControl = L.Routing.control({
      waypoints: [
        startPoint, // Start point (user's location)
        L.latLng(44.66, 20.92), // End point (example)
      ],
      lineOptions: lineOptions,
    }).addTo(this.map);
  
    this.routingControl.on('routesfound', (event) => {
      this.updateRouteInfoBasedOnRoute();
    });
  
    setTimeout(() => {
      // Hide the routing control's instructions panel
      const routeInstructionsContainer = this.routingControl.getContainer();
      if (routeInstructionsContainer) {
        routeInstructionsContainer.style.display = 'none';
      }
    }, 0);
  }

  private async fetchPollutionData(): Promise<void> {
    // Example locations to fetch pollution data for (replace with actual locations)
    const locations = ['@14566','@9257','@9259'];

    for (const location of locations) {
      try {
        const response = await fetch(`https://api.waqi.info/feed/${location}/?token=c6513139364f09061c9e511a542f026eae1346af`);
        const data = await response.json();

        // Extract name, coordinates, and pollution data from the API response
        const { name } = data.data.city;
        const [latitude, longitude] = data.data.city.geo; // Extract latitude and longitude
        const aqi = data.data.aqi; // Example: AQI value

        // Add circle to the map based on pollution data
        this.addCircleToMap(latitude, longitude, aqi, name);
      } catch (error) {
        console.error('Error fetching pollution data:', error);
      }
    }
  }

  private addCircleToMap(latitude: number, longitude: number, aqi: number, name: string): void {
    let color = 'green'; // Default color for good air quality
    let radius = 300; // Default radius for the circle

    // Adjust circle color and radius based on AQI value
    if (aqi > 50) {
      color = 'yellow'; // Moderate air quality
      radius = 400;
    }
    if (aqi > 100) {
      color = 'orange'; // Unhealthy for sensitive groups
      radius = 500;
    }
    if (aqi > 150) {
      color = 'red'; // Unhealthy
      radius = 600;
    }

    // Create circle and add it to the map
    L.circle([latitude, longitude], { color, fillColor: color, fillOpacity: 0.5, radius }).addTo(this.map)
      .bindPopup(`${name}: AQI ${aqi}`).openPopup();
  }

  updateRoute(destination: L.LatLng): void {
    if (this.routingControl) {
      const waypoints = [
        this.routingControl.getWaypoints()[0].latLng, // Current location or start point
        destination, // New destination chosen by the user
      ];
      this.routingControl.setWaypoints(waypoints);
    }
  }

  updateRouteInfo(info: string) {
    this.routeInfo = info;
  }

  private updateRouteInfoBasedOnRoute() {
    const startPoint = this.routingControl.getWaypoints()[0].latLng;
    const endPoint = this.routingControl.getWaypoints()[1].latLng;
    const distance = startPoint.distanceTo(endPoint);
  
    const timeInSeconds = distance / 2;
    
    const timeInMinutes = Math.round(timeInSeconds / 60);
  
    const routeInfo = `${distance.toFixed(2)} meters, ${timeInMinutes} min`;
    this.updateRouteInfo(routeInfo);
  }

  goBack() {
    this.navCtrl.back(); // Navigate back to the previous page
  }

  saveRoute() {
    if (this.routeInfo !== null) {
      this.firebaseService.saveRoute(this.routeInfo)
        .then(() => {
          console.log('Route saved successfully');
          this.showToast("Route saved successfully");
          // Optionally, you can add a toast or notification to indicate successful save
        })
        .catch((error) => {
          console.error('Error saving route: ', error);
          this.showToast('Error saving route: ');
          // Optionally, you can add a toast or notification to indicate error
        });
    }
  }

  showToast(message: string){
    this.toastCtrl.create({
      message: message,
      duration: 3000
    }).then(toastData => toastData.present())
  }

}
