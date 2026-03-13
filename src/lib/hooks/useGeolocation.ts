import { createSignal, onCleanup, onMount } from "solid-js";
import { getAddressFromCoordinates } from "../geocoding";

export function useGeolocation() {
  const [location, setLocation] = createSignal<{
    latitude: number;
    longitude: number;
    accuracy: number;
  } | null>(null);
  const [error, setError] = createSignal<string | null>(null);
  const [loading, setLoading] = createSignal(true);
  
  // New state for live address
  const [address, setAddress] = createSignal<string | null>(null);
  const [isAddressLoading, setIsAddressLoading] = createSignal(false);

  let watchId: number | null = null;
  // Track last fetched coordinates to avoid spamming the Google Maps API
  let lastFetchedLat = 0;
  let lastFetchedLng = 0;

  onMount(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        setLocation({
          latitude: lat,
          longitude: lng,
          accuracy: position.coords.accuracy,
        });
        setLoading(false);

        // Fetch address if it's the first time OR if movement is significant (e.g. roughly > 20 meters change to avoid spamming the API)
        // 0.0002 decimal degrees is roughly 22 meters at the equator
        if (!address() || Math.abs(lat - lastFetchedLat) > 0.0002 || Math.abs(lng - lastFetchedLng) > 0.0002) {
          lastFetchedLat = lat;
          lastFetchedLng = lng;
          setIsAddressLoading(true);
          
          const newAddress = await getAddressFromCoordinates(lat, lng);
          if (newAddress) setAddress(newAddress);
          
          setIsAddressLoading(false);
        }
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  });

  onCleanup(() => {
    if (watchId !== null && typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId);
    }
  });

  return { location, error, loading, address, isAddressLoading };
}
