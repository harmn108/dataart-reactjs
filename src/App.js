import React from "react";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import RoutesList from "./RoutesList";

function App() {
  return (
    <>
      <Header />
      <RoutesList />
      <Footer />
    </>
  );
}

export default App;
