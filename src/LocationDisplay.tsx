import { useState, useEffect } from 'react';
import { Storage } from 'aws-amplify';

interface LocationData {
  lat: number;
  lng: number;
  timestamp: string;
  userId: string;
}

export default function LocationDisplay({ user }) {
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
  if (!user) return; // Si no hay usuario, no guarda nada
    
  setIsUploading(true);
  setUploadStatus('Guardando en S3...');

  // 1. Estructura los datos en un objeto JSON
  const locationData = {
    lat,
    lng,
    timestamp: new Date().toISOString(), // Fecha actual en formato estándar
    userId: user.username || user.signInDetails?.loginId // Identificador del usuario
  };

  try {
    // 2. Define la ruta donde se guardará en S3
    const fileName = `ubicaciones/${user.username}/${Date.now()}.json`;
    
    // 3. Sube el archivo a S3 usando Amplify Storage
    await Storage.put(fileName, JSON.stringify(locationData), {
      contentType: 'application/json', // Indica que es un JSON
      level: 'private' // Solo el usuario puede acceder a sus archivos
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
        <p style={{ color: 'red' }}>Error: {location.error}</p>
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
