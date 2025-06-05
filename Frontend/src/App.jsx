import React from 'react'
import Login from './Pages/Login'
import Home from './Pages/Home'
import Signup from './Pages/Signup'
import {Routes,Route,Navigate} from 'react-router-dom'
import { useSelector } from 'react-redux'


const App = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const token = localStorage.getItem('token');
  return (
    <div>
  <Routes>
    <Route path='/' element={<Login/>}/>
    <Route path='/signup' element={<Signup/>}/>
    <Route path='/home' element={token ?<Home/>:<Navigate to="/"/>}/>
  </Routes>
  </div>
  ) 
}

export default App