import { useState, useEffect } from 'react';
import { AmazonLocationServiceProvider } from '@aws-amplify/geo';
import { MapView, Marker } from '@aws-amplify/ui-react-geo';
import { Alert, Loader } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react-geo/styles.css';

const locationService = new AmazonLocationServiceProvider();

interface LocationDisplayProps {
  user: {
    username?: string;
    signInDetails?: {
      loginId?: string;
    };
  };
}

export default function LocationDisplay({ user }: LocationDisplayProps) {
  const [location, setLocation] = useState<{
    lat: number | null;
    lng: number | null;
    error: string | null;
  }>({
    lat: null,
    lng: null,
    error: null
  });
  const [isSaving, setIsSaving] = useState(false);

  // Función para guardar en Amazon Location Service
  const saveToAmazonLocation = async (lat: number, lng: number) => {
    if (!user?.username) return;
    
    setIsSaving(true);
    try {
      await locationService.saveDevicePosition({
        deviceId: user.username,
        position: [lng, lat],
        sampleTime: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error saving to Amazon Location:", error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation(prev => ({ ...prev, error: "Geolocation no soportada" }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({
          lat: latitude,
          lng: longitude,
          error: null
        });
        saveToAmazonLocation(latitude, longitude);
      },
      (error) => {
        setLocation(prev => ({ ...prev, error: error.message }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }, [user]);

  return (
    <div style={{ padding: '1rem' }}>
      {location.error ? (
        <Alert variation="error">{location.error}</Alert>
      ) : location.lat ? (
        <div>
          <div style={{ height: '400px', margin: '10px 0' }}>
            <MapView 
              initialViewState={{
                latitude: location.lat,
                longitude: location.lng,
                zoom: 14
              }}
            >
              <Marker 
                latitude={location.lat}
                longitude={location.lng}
              >
                <div style={{ color: 'red', fontSize: '24px' }}>📍</div>
              </Marker>
            </MapView>
          </div>
          <p>Latitud: {location.lat.toFixed(6)}</p>
          <p>Longitud: {location.lng?.toFixed(6)}</p>
          {isSaving && <Loader size="small" />}
        </div>
      ) : (
        <Loader size="large" />
      )}
    </div>
  );
}
