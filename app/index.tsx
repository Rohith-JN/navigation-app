import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useState, useEffect, useRef } from 'react';
import { Stack } from 'expo-router';
import * as Location from 'expo-location';
import MapViewDirections from 'react-native-maps-directions';

const GOOGLE_MAPS_API_KEY = '';

const Index = () => {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [searchedLocation, setSearchedLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [value, setValue] = useState('');
  const mapRef = useRef<MapView>(null);

  async function searchLocation(query: string) {
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.length > 0) {
        const newLocation = {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
        };
        setSearchedLocation(newLocation);
        mapRef.current?.animateToRegion({
          ...newLocation,
          latitudeDelta: 0.0052,
          longitudeDelta: 0.0051,
        });
      } else {
        alert('Location not found');
      }
    } catch (error) {
      console.error('Error searching location:', error);
    }
  }

  function fitMarkers() {
    if (userLocation && searchedLocation && mapRef.current) {
      mapRef.current.fitToCoordinates([userLocation, searchedLocation], {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  }

  const [directionsReady, setDirectionsReady] = useState(false);

  useEffect(() => {
    if (searchedLocation) {
      setDirectionsReady(false); // Reset before updating
      setTimeout(() => setDirectionsReady(true), 100); // Small delay to trigger re-render
    }
  }, [searchedLocation]);


  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      let location = await Location.getCurrentPositionAsync({});
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let currentLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setUserLocation(currentLocation);
    })();
  }, []);

  if (userLocation) {
    return (
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={{ flex: 1 }}>
            <View style={{ height: '75%' }}>
              <MapView
                ref={mapRef}
                style={{ flex: 1 }}
                initialRegion={{
                  latitude: userLocation.latitude,
                  longitude: userLocation.longitude,
                  latitudeDelta: 0.0052,
                  longitudeDelta: 0.0051,
                }}
              >
                <Marker coordinate={userLocation} pinColor="blue" />
                {searchedLocation && <Marker coordinate={searchedLocation} title="Searched Location" />}

                {searchedLocation && directionsReady && (
                  <MapViewDirections
                    origin={userLocation}
                    destination={searchedLocation}
                    apikey={GOOGLE_MAPS_API_KEY}
                    strokeWidth={4}
                    strokeColor="black"
                    mode="DRIVING"
                  />
                )}
              </MapView>
            </View>

            <View style={{ height: '25%', padding: 12 }}>
              <TextInput
                style={{
                  height: 40,
                  marginBottom: 10,
                  borderWidth: 1,
                  padding: 10,
                  backgroundColor: '#DDDDDF',
                  borderRadius: 8,
                  fontSize: 16,
                }}
                placeholder="Search for a location!"
                placeholderTextColor="grey"
                onChangeText={setValue}
                value={value}
                onSubmitEditing={() => searchLocation(value)}
                spellCheck={false}
                autoCorrect={false}
              />

              {searchedLocation && (
                <TouchableOpacity
                  style={{
                    backgroundColor: 'black',
                    padding: 12,
                    borderRadius: 8,
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    fitMarkers();
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 16 }}>Get Directions</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  } else {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        {errorMsg ? <Text>{errorMsg}</Text> : <Text>Waiting for location...</Text>}
      </View>
    );
  }
};

export default Index;
