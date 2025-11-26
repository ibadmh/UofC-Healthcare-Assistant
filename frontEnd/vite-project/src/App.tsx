import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { sendMessage } from "./api/chat";

function App() {
  return (
    <div className="w-screen h-screen flex items-center justify-center text-gray-800">
      <h1>UHealth Friend (Frontend Running)</h1>
    </div>
  );
}


export default App
