import { useState } from 'react';
import './App.css';
import Chat from './pages/Chat';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider } from "react-redux"
import { store } from './app/store';
import { Toaster } from 'sonner'

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_ID}>
      <Provider store={store}>
        <Toaster
          richColors
          position="top-right" />
        <Chat />
      </Provider>
    </GoogleOAuthProvider>
  )
}

export default App;