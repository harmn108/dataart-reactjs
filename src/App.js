import React from "react";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Dashboard from "./containers/Dashboard";

function App() {
  return (
    <>
      <Header />
      <Dashboard />
      <Footer />
    </>
  );
}

export default App;
