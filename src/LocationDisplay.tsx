import { useState, useEffect } from 'react';
import { Amplify, Storage } from 'aws-amplify';
import { Alert, Loader } from '@aws-amplify/ui-react';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

interface UserData {
  username?: string;
  signInDetails?: {
    loginId?: string;
  };
}

interface LocationDisplayProps {
  user: UserData;
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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  const saveToS3 = async (lat: number, lng: number) => {
    if (!user?.username) return;
    
    setIsUploading(true);
    setUploadStatus('Guardando en S3...');

    try {
      const locationData = {
        lat,
        lng,
        timestamp: new Date().toISOString(),
        userId: user.username || user.signInDetails?.loginId
      };

      const fileName = `ubicaciones/${user.username}/${Date.now()}.json`;
      await Storage.put(fileName, JSON.stringify(locationData), {
        contentType: 'application/json',
        level: 'private'
      });
      setUploadStatus('Ubicación guardada exitosamente');
    } catch (error) {
      console.error('Error al guardar en S3:', error);
      setUploadStatus('Error al guardar');
    } finally {
      setIsUploading(false);
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
        saveToS3(latitude, longitude);
      },
      (error) => {
        setLocation(prev => ({ ...prev, error: error.message }));
      }
    );
  }, [user]);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Tu Ubicación Actual</h2>
      
      {location.error ? (
        <Alert variation="error">{location.error}</Alert>
      ) : location.lat ? (
        <div>
          <p>Latitud: {location.lat.toFixed(6)}</p>
          <p>Longitud: {location.lng?.toFixed(6)}</p>
          <a
            href={`https://www.google.com/maps?q=${location.lat},${location.lng}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver en Google Maps
          </a>
        </div>
      ) : (
        <p>Obteniendo ubicación...</p>
      )}

      {isUploading && <p>{uploadStatus}</p>}
    </div>
  );
}
      {isUploading && <p>{uploadStatus}</p>}
    </div>
  );
}
