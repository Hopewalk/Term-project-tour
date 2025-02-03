import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Oneday from "./Userpage/Oneday";
import Triprest from "./Userpage/Triprest";
import MenuAdmin from "./Component/menubarAM";
import EditPro from "./Editpro";
import Dashboard from "./Adminpage/Dashboard";
import Register from "./Register";
import Createoredit from "./Adminpage/Createoredit";
import TripOverview from "./Userpage/Overview";
import Pay from "./Userpage/Payment";

function App() {
  return (
    <BrowserRouter>
      <MenuAdmin />
      <Routes>
        <Route path="/" element={<Navigate to="/Home" />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Onedaytrip" element={<Oneday />} />
        <Route path="/Trip&Rest" element={<Triprest />} />
        <Route path="/Profile" element={<EditPro />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Createoredittrip" element={<Createoredit />} />
        <Route path="/trip" element={<TripOverview />} />
        <Route path="/Payment" element={<Pay />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
