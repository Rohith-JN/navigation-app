import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  TextInput,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useState, useEffect, useRef } from 'react';
import { Stack } from 'expo-router';
import * as Location from 'expo-location';
import MapViewDirections from 'react-native-maps-directions';

const GOOGLE_MAPS_API_KEY = ''

const Index = () => {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [searchedLocation, setSearchedLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState<String>("");
  const mapRef = useRef<MapView>(null);
  const [value, setValue] = useState('');

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
            <View style={{ height: '80%' }}>
              <MapView
                ref={mapRef}
                style={{ flex: 1 }}
                region={{
                  latitude: userLocation.latitude,
                  longitude: userLocation.longitude,
                  latitudeDelta: 0.0052,
                  longitudeDelta: 0.0051,
                }}
              >

                <Marker
                  coordinate={userLocation}
                  pinColor="blue"
                />
                {searchedLocation && <Marker coordinate={searchedLocation} title="Searched Location" />}
                {userLocation && searchedLocation && (
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
            <View style={{ height: '20%' }}>
              <TextInput
                style={{
                  height: 40,
                  margin: 12,
                  borderWidth: 1,
                  padding: 10,
                  backgroundColor: '#DDDDDF',
                  borderRadius: 8,
                  fontSize: 16,
                  paddingLeft: 15,
                }}
                placeholder='Search for a location!'
                placeholderTextColor={'grey'}
                onChangeText={setValue}
                value={value}
                onSubmitEditing={() => searchLocation(value)}
                spellCheck={false}
                autoCorrect={false}
              />
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
        {errorMsg ? (
          <Text>{errorMsg}</Text>
        ) : (
          <Text>Waiting for location...</Text>
        )}
      </View>
    );
  }
};

export default Index

