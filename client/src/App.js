import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/Auth.context.js";
import TourPage from "./TourPage.js";
import Login from "./Auth/Login.js";
import Oneday from "./User/Oneday.js";
import Triprest from "./User/Triprest.js";
import MenuUnden from "./Component/menu.js";
import MenuAdmin from "./Admin/Component/menubarAM.js";
import MenuUser from "./User/Component/menubarUS.js";
import EditProfile from "./User/Profile.js";
import Register from "./Auth/Register.js";
import AddTrip from "./Admin/Addtrip.js";
import TripOverview from "./User/Overview.js";
import Status from "./Admin/Status.js";
import Edittrip from "./Admin/Editpage.js";
import Footer from "./Component/Footer.js";
import Historylist from "./User/History.js";
import Trip_statistic from "./Admin/Trips_statistic.js";
import BookingForm from "./User/Booking.js";
import Home from "./Home.js";

function App() {
  const { state } = useContext(AuthContext);

  const role = state.user?.role;

  return (
    <div className="app-container">
      <BrowserRouter>
        <header>
          {!state.isLoggedIn ? (
            <MenuUnden />
          ) : role === "Admin" ? (
            <MenuAdmin />
          ) : (
            <MenuUser />
          )}
        </header>
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Navigate to="/Home" />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/Tour" element={<TourPage />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/Onedaytrip" element={<Oneday />} />
            <Route path="/Trip&Rest" element={<Triprest />} />
            <Route path="/Trip/:documentId" element={<TripOverview />} />

            {state.isLoggedIn && role === "Admin" && (
              <>
                <Route path="/Create" element={<AddTrip />} />
                <Route path="/Status" element={<Status />} />
                <Route path="/Trips/edit" element={<Edittrip />} />
                <Route path="/Trips/statistic" element={<Trip_statistic />} />
                <Route path="/Booking/:documentId" element={<BookingForm />} />
              </>
            )}

            {state.isLoggedIn && role !== "Admin" && (
              <>
                <Route path="/Profile" element={<EditProfile />} />
                <Route path="/History" element={<Historylist />} />
                <Route path="/Booking/:documentId" element={<BookingForm />} />
              </>
            )}
          </Routes>
        </main>
        <footer>
          <Footer />
        </footer>
      </BrowserRouter>
    </div>
  );
}

export default App;
