# Navigation App

## Overview
This is a **React Native Expo** application that allows users to:
- View their **current location** on a map.
- **Search for locations** using OpenStreetMap's Nominatim API.
- Display a **route from the user's location to the searched location** using Google Maps Directions API.

## Features
- **User Location Tracking:** Automatically detects and displays the user's location.
- **Search Functionality:** Users can enter a location name, and the app finds and displays it on the map.
- **Dynamic Routing:** Draws a route between the user’s location and the searched location.
- **Interactive Map:** Supports zooming and panning.
- **Marker Customization:** User location is marked in blue, and the searched location is marked with a pin.

## Prerequisites
Ensure you have the following installed:
- **Expo CLI** (`npm install -g expo-cli`)
- **Google Maps API Key** (for Directions API usage)

## Setup Instructions

1. **Clone the Repository**
   ```sh
   git clone https://github.com/Rohith-JN/navigation-app.git
   cd navigation-app
   ```

2. **Install Dependencies**
   ```sh
   npm install
   ```

3. **Add Your Google Maps API Key**
   - Open `Index.tsx`.
   - Replace the placeholder key in:
     ```tsx
     const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';
     ```

4. **Run the App**
   ```sh
   npm run start
   ```

5. **Test on a Physical Device**
   - Install the **Expo Go** app on your Android/iOS device.
   - Scan the QR code generated in the terminal after running `npm run start`.

## Technologies Used
- **React Native** (with Expo)
- **react-native-maps** (for map rendering)
- **react-native-maps-directions** (for route drawing)
- **OpenStreetMap Nominatim API** (for location search)
- **Google Maps Directions API** (for route generation)

## Preview

<div style={{display: "flex", flexDirection: "row"}}>
   <img src = "https://github.com/user-attachments/assets/31effd05-4709-48f2-92c4-e5af2a53a22d" width=250 height=auto />
   <img src = "https://github.com/user-attachments/assets/43be6dcf-a638-4860-8766-80098860bf4c"width=250 height=auto />
   <img src = "https://github.com/user-attachments/assets/be8b5641-7e9d-42f1-bbc9-79c9553a6050"width=250 height=auto />
</div>


