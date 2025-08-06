import { useState } from 'react'
import './App.css'
import{ BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NavigationBar from './components/NavigationBar'
import Home from './components/home'
import ProductList from './components/ProductList'
import AddProduct from './components/AddProduct'
import ProductDetails from './components/ProductDetails'

function App() {
  

  return (
    <>
      <NavigationBar />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<div>Products Page</div>} />
          <Route path="/add-product" element={<div>Add Product Page</div>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
