
import { useState } from 'react';
import { Route } from 'antd/lib/breadcrumb/Breadcrumb';
import './App.css';
import Dashboard from './dashboard';
import Loginform from './login';
function App() {
  const msnv =()=>{
    return localStorage.getItem('msnv')?true:false
    
  }
  return (
    <div className="App">
     <Loginform/>
     <Dashboard/>
    </div>
  );
}

export default App;
