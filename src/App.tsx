import { useEffect, useState } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import LocationDisplay from "./LocationDisplay";
import { Amplify } from 'aws-amplify';
import { fetchAuthSession } from 'aws-amplify/auth';
import {
  LocationClient,
  AssociateTrackerConsumerCommand
} from '@aws-sdk/client-location';
import outputs from '../amplify_outputs.json';
Amplify.configure(outputs);

const createClient = async () => {
  const session = await fetchAuthSession();
  const client = new LocationClient({
    credentials: session.credentials,
    region: amplifyconfig.aws_project_region
  });
  return client;
};

const client = generateClient<Schema>();

function App() {

  const { user, signOut } = useAuthenticator();
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }

    
  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }

    // UpdateDevicePosition API
  const params = {
    TrackerName: 'trackerId',
    Updates: [
      {
        DeviceId: 'deviceId',
        Position: [-122.431297, 37.773972],
        SampleTime: new Date()
      }
    ]
  };
  const command = new BatchUpdateDevicePositionCommand(params);
  client.send(command, (err, data) => {
    if (err) console.error(err);
    if (data) console.log(data);
  });
  
  // GetDevicePosition API
  const client = await createClient();
  const params = {
    TrackerName: 'trackerId',
    DeviceId: 'deviceId'
  };
  const command = new GetDevicePositionCommand(params);
  client.send(command, (err, data) => {
    if (err) console.error(err);
    if (data) console.log(data);
  });
  
  return (
    <main>
      <h1>{user?.signInDetails?.loginId}'s todos</h1>
      <h1>My todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li
            onClick={() => deleteTodo(todo.id)}
            key={todo.id}>{todo.content}</li>
        ))}
      </ul>
      <div>
        <h2>Location</h2>
        <LocationDisplay />
      </div>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}

export default App;
