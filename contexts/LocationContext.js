"use client";

import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LocationContext = React.createContext();
const UpdateLocationContext = React.createContext();
const LocationLoadingContext = React.createContext();

export function useLocation() {
  return useContext(LocationContext);
}
export function useUpdateLocation() {
  return useContext(UpdateLocationContext);
}
export function useLocationLoading() {
  return useContext(LocationLoadingContext);
}

export default function LocationProvider({ children }) {
  const [selectedLocation, setSelectedLocation] = useState({});
  const [locationLoading, setLocationLoading] = useState(true);

  const updateSelectedLocation = (location) => {
    setSelectedLocation(location);
    AsyncStorage.setItem("selectedLocation", JSON.stringify(location));
  };

  useEffect(() => {
    (async () => {
      try {
        setLocationLoading(true);
        const { data } = await axios.get(
          "https://mazinda.com/api/location/fetch-locations"
        );
        let selectedLocation;

        try {
          selectedLocation = await AsyncStorage.getItem("selectedLocation");
          selectedLocation = JSON.parse(selectedLocation);
        } catch (e) {
          console.log(e);
        }

        if (selectedLocation) {
          setSelectedLocation(selectedLocation);
        } else {
          // If no selected location in cookies, set the first location as default
          setSelectedLocation(data.locations[1]);

          // Setting location info in cookies
          AsyncStorage.setItem(
            "selectedLocation",
            JSON.stringify(data.locations[1])
          );
        }
        setLocationLoading(false);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    })();
  }, []);

  return (
    <>
      <LocationContext.Provider value={selectedLocation}>
        <UpdateLocationContext.Provider value={updateSelectedLocation}>
          <LocationLoadingContext.Provider value={locationLoading}>
            {children}
          </LocationLoadingContext.Provider>
        </UpdateLocationContext.Provider>
      </LocationContext.Provider>
    </>
  );
}
