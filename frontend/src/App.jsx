import { useState } from 'react'
import './App.css'
import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import TopSellers from './pages/home/TopSeller'
import {  AuthProvider } from './context/AuthContext'
// import { AdminProvider } from './context/AdminContext'

function App() {

  return (
<>
 <AuthProvider>
  {/* <AdminProvider> */}
  <Navbar/>
  <main className='min-h-screen max-w-screen-2xl mx-auto 
  '>
  <Outlet/>

  </main>
  <Footer/>
  {/* </AdminProvider> */}
  </AuthProvider>
</>
  )
}

export default App
