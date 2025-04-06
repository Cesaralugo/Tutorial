import { useAuthenticator } from '@aws-amplify/ui-react';
import LocationDisplay from "./LocationDisplay";

function App() {
  const { user, signOut } = useAuthenticator(); // ✅ Ya tienes el usuario logueado

  return (
    <main>
      <h1>Bienvenido, {user?.signInDetails?.loginId}</h1>
      
      <div>
        <h2>Obtener Ubicación</h2>
        <LocationDisplay user={user} /> {/* Pasamos el usuario como prop */}
      </div>

      <button onClick={signOut}>Cerrar sesión</button>
    </main>
  );
}

export default App;
