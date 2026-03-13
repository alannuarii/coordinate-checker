import axios from 'axios';

export async function getAddressFromCoordinates(lat: number, lng: number): Promise<string | null> {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.warn("VITE_GOOGLE_MAPS_API_KEY is not defined in .env");
    return null;
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
    const response = await axios.get(url);
    
    if (response.data && response.data.status === 'OK' && response.data.results.length > 0) {
      // The first result is typically the most accurate/formatted street address
      return response.data.results[0].formatted_address;
    } else {
      console.warn("Geocoding failed:", response.data.status);
      return null;
    }
  } catch (error) {
    console.error("Error fetching geocoding data:", error);
    return null;
  }
}
