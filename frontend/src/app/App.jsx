import React, { useEffect } from 'react'
import { RouterProvider } from "react-router-dom";
import { routes } from "./App.Routes";
import { useAuth } from '../features/auth/hooks/useAuth';
import { ToastContainer, } from 'react-toastify';
function App() {
  const auth = useAuth();
  useEffect(() => {
    auth.handleGetMe()
  }, [])
  return (
    <div>
      <RouterProvider router={routes} />
      <ToastContainer />
    </div>
  )
}

export default App