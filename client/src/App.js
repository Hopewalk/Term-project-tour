import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/Auth.context.js";
import Home from "./Home.js";
import Login from "./Auth/Login.js";
import Oneday from "./User/Oneday.js";
import Triprest from "./User/Triprest.js";
import MenuUnden from "./Component/menu.js";
import MenuAdmin from "./Admin/Component/menubarAM.js";
import MenuUser from "./User/Component/menubarUS.js";
import ProfileAm from "./Admin/Profile.js";
import EditProfile from "./User/Profile.js";
import Dashboard from "./Admin/Dashboard.js";
import Register from "./Auth/Register.js";
import AddTrip from "./Admin/Addtrip.js";
import TripOverview from "./User/Overview.js";
import Pay from "./User/Payment.js";
import Status from "./Admin/Status.js";
import Edittrip from "./Admin/Editpage.js";
import Footer from "./Component/Footer.js";

function App() {
  const { state } = useContext(AuthContext);

  if (!state.isLoggedIn) {
    return (
      <BrowserRouter>
        <MenuUnden />
        <Routes>
          <Route path="/" element={<Navigate to="/Home" />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Onedaytrip" element={<Oneday />} />
          <Route path="/Trip&Rest" element={<Triprest />} />
          <Route path="/Trip/:documentId" element={<TripOverview />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    );
  }

  if (state.isLoggedIn) {
    const role = state.user.role;
    return (
      <BrowserRouter>
        <div>{role === "Admin" ? <MenuAdmin /> : <MenuUser />}</div>
        <Routes>
          {role === "Admin" ? (
            <>
              <Route path="/Login" element={<Navigate to={"/"} />} />
              <Route path="/" element={<Navigate to="/Home" />} />
              <Route path="/Home" element={<Home />} />
              <Route path="/Onedaytrip" element={<Oneday />} />
              <Route path="/Trip&Rest" element={<Triprest />} />
              <Route path="/Dashboard" element={<Dashboard />} />
              <Route path="/Profile" element={<ProfileAm />} />
              <Route path="/Create" element={<AddTrip />} />
              <Route path="/Status" element={<Status />} />
              <Route path="/Trip/:documentId" element={<TripOverview />} />
              <Route path="/Trips/edit" element={<Edittrip />} />
            </>
          ) : (
            <>
              <Route path="/Login" element={<Navigate to={"/"} />} />
              <Route path="/" element={<Navigate to="/Home" />} />
              <Route path="/Home" element={<Home />} />
              <Route path="/Onedaytrip" element={<Oneday />} />
              <Route path="/Trip&Rest" element={<Triprest />} />
              <Route path="/Profile" element={<EditProfile />} />
              <Route path="/Trip/:documentId" element={<TripOverview />} />
              <Route path="/Payment" element={<Pay />} />
            </>
          )}
        </Routes>
        <Footer />
      </BrowserRouter>
    );
  }
}
export default App;
