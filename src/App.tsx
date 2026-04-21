import React, { useState } from 'react';
import { Login } from './components/Login';
import { PayrollSystem } from './components/PayrollSystem';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return <PayrollSystem />;
}

