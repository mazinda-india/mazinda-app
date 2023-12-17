'use client'

import React, { useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

const LocationContext = React.createContext()
const UpdateLocationContext = React.createContext()
const LocationLoadingContext = React.createContext()

export function useLocation() {
    return useContext(LocationContext)
}
export function useUpdateLocation() {
    return useContext(UpdateLocationContext)
}
export function useLocationLoading() {
    return useContext(LocationLoadingContext)
}

export default function LocationProvider({ children }) {
    const [selectedLocation, setSelectedLocation] = useState({})
    const [locationLoading, setLocationLoading] = useState(true)

    const updateSelectedLocation = (location) => {
        setSelectedLocation(location)
        Cookies.set("selectedLocation", JSON.stringify(location), {
            expires: 1000,
        });
    }

    useEffect(() => {
        (async () => {
            try {
                setLocationLoading(true)
                const response = await axios.get("/api/location/fetch-locations");
                let selectedLocation;

                try {
                    selectedLocation = Cookies.get("selectedLocation");
                    selectedLocation = JSON.parse(selectedLocation);
                } catch (e) {
                    console.log(e);
                }

                if (selectedLocation) {
                    setSelectedLocation(selectedLocation);
                } else {
                    // If no selected location in cookies, set the first location as default
                    setSelectedLocation(response.data.locations[2]);

                    // Setting location info in cookies
                    Cookies.set(
                        "selectedLocation",
                        JSON.stringify(response.data.locations[0]),
                        { expires: 1000 }
                    );
                }
                setLocationLoading(false);
            } catch (error) {
                console.error("Error fetching locations:", error);
            }
        })()
    }, [])


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
    )
}