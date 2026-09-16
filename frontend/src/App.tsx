import { Route, Routes } from "react-router-dom";
import "./styles/global.css";
import Facilities from "./pages/Facilities";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Challenges from "./pages/Challenges";
import Account from "./pages/Profile";
import Facility from "./pages/Facility";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import Navbar from "./components/Navbar";
import Challenge from "./pages/Challenge";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Facilities />
            </PrivateRoute>
          }
        />
        <Route
          path="/challenges"
          element={
            <PrivateRoute>
              <Challenges />
            </PrivateRoute>
          }
        />
        <Route
          path="/challenges/:challengeId"
          element={
            <PrivateRoute>
              <Challenge />
            </PrivateRoute>
          }
        />
        ,
        <Route
          path="/account"
          element={
            <PrivateRoute>
              <Account />
            </PrivateRoute>
          }
        />
        <Route
          path="/facility/:facilityId"
          element={
            <PrivateRoute>
              <Facility />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
