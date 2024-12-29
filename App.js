import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Nav from "./components/Nav";
import Home from "./components/Home";
import Products from "./components/Products";
import Categories from "./components/Categories";
import Suppliers from "./components/Suppliers";
import Restocking from "./components/Restocking";
import Sales from "./components/Sales";
import Alert from "./components/Alert";
import './components/styles.css'
function App() {
  return (
    <Router>
      <div>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/restocking" element={<Restocking />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/alerts" element={<Alert />} />
          <Route path="/nav" element={<Nav />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
