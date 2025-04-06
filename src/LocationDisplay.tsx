import { useState, useEffect } from 'react';
import { MapView, LocationSearch } from '@aws-amplify/ui-react-geo';
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';
import '@aws-amplify/ui-react-geo/styles.css';

Amplify.configure(awsconfig);

export default function LocationDisplay() {
  const [coordinates, setCoordinates] = useState<{lat: number, lng: number} | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation no está soportada en tu navegador");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (err) => {
        setError(`Error al obtener ubicación: ${err.message}`);
      }
    );
  }, []);

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <h2>Mi Ubicación Actual</h2>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <div style={{ height: '500px', marginTop: '1rem' }}>
        <MapView 
          initialViewState={{
            latitude: coordinates?.lat || 0,
            longitude: coordinates?.lng || 0,
            zoom: coordinates ? 14 : 2
          }}
        >
          {coordinates && (
            <Marker 
              latitude={coordinates.lat}
              longitude={coordinates.lng}
              anchor="bottom"
            >
              <div style={{ color: 'red', fontSize: '24px' }}>📍</div>
            </Marker>
          )}
        </MapView>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3>Buscar ubicación</h3>
        <LocationSearch 
          onSelect={(result) => {
            setCoordinates({
              lat: result.geometry.y,
              lng: result.geometry.x
            });
          }}
        />
      </div>
    </div>
  );
}
