import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function MapPickerScreen({ navigation, route }: any) {
  const [location, setLocation] = useState<any>(null);
  const [address, setAddress] = useState<string>("Fetching current location...");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setAddress("Permission denied");
        setLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const region = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setLocation(region);
      fetchAddress(loc.coords.latitude, loc.coords.longitude);
      setLoading(false);
    })();
  }, []);

  const fetchAddress = async (lat: number, lng: number) => {
    const [place] = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
    if (place) {
      const formatted = `${place.name || ""}, ${place.city || place.region || ""}`;
      setAddress(formatted);
    } else {
      setAddress("Unknown location");
    }
  };

  const handleRegionChange = async (region: Region) => {
    setLocation(region);
    fetchAddress(region.latitude, region.longitude);
  };

  const handleConfirm = () => {
    navigation.navigate("Home", { selectedLocation: address });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#C6A664" />
        <Text style={{ color: "#555", marginTop: 10 }}>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={location}
        onRegionChangeComplete={handleRegionChange}
        showsUserLocation
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            draggable
            onDragEnd={(e) =>
              handleRegionChange({
                ...location,
                latitude: e.nativeEvent.coordinate.latitude,
                longitude: e.nativeEvent.coordinate.longitude,
              })
            }
          />
        )}
      </MapView>

      <View style={styles.overlay}>
        <Ionicons name="location-outline" size={20} color="#C6A664" />
        <Text numberOfLines={1} style={styles.addressText}>
          {address}
        </Text>
      </View>

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
        <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
        <Text style={styles.confirmText}>Confirm Location</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  addressText: {
    flex: 1,
    color: "#333",
    marginLeft: 6,
    fontSize: 13,
  },
  confirmButton: {
    position: "absolute",
    bottom: 40,
    left: width * 0.2,
    right: width * 0.2,
    backgroundColor: "#C6A664",
    borderRadius: 30,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  confirmText: {
    color: "#fff",
    fontWeight: "700",
    marginLeft: 6,
  },
});
