import { useEffect, useState } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react';
import LocationDisplay from "./LocationDisplay";
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

function App() {
  const { user, signOut } = useAuthenticator();

  return (
    <main>
      <h1>Bienvenido, {user?.signInDetails?.loginId}</h1>
      
      {/* Sección de Ubicación */}
      <div style={{ margin: '20px 0', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h2>Ubicación Actual</h2>
        <LocationDisplay user={user} />
      </div>

      <button onClick={signOut}>Cerrar sesión</button>
    </main>
  );
}

export default App;
