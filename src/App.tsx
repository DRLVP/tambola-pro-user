import { useEffect } from 'react';
import { RouterProvider } from 'react-router';
import router from './router';

import { useSocketStore } from './stores';

function App() {
  const initializeSocket = useSocketStore((state) => state.initializeSocket);
  const disconnectSocket = useSocketStore((state) => state.disconnectSocket);

  useEffect(() => {
    initializeSocket();
    return () => disconnectSocket();
  }, [initializeSocket, disconnectSocket]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;
