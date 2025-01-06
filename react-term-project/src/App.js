import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Oneday from "./Userpage/Oneday";
import Triprest from "./Userpage/Triprest";
import ResponsiveAppBar from "./Component/menubar";

function App() {
  return (
    <BrowserRouter>
      <ResponsiveAppBar />
      <Routes>
        <Route path="/" element={<Navigate to="/Home" />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Onedaytrip" element={<Oneday />} />
        <Route path="/Trip&Rest" element={<Triprest />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
