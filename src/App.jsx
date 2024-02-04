import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import HomePage from "./pages/HomePage.jsx";
import LogIn from "./pages/Login.jsx";
import SideBar from "./components/SideBar.jsx";

function App() {
  return (
    <>
      <SideBar></SideBar>
    </>
  );
}

export default App;
