import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Oneday from "./Userpage/Oneday";
import Triprest from "./Userpage/Triprest";
import ResponsiveAppBar from "./Component/menubar";
import EditPro from "./Editpro";
import Dashboard from "./Adminpage/Dashboard";
import Register from "./Register";

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
        <Route path="/Editprofile" element={<EditPro />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
