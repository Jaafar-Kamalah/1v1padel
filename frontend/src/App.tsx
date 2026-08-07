import { Route, Routes } from "react-router-dom";
import "./styles/global.css"
import Facilities from "./pages/Facilities";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import Facility from "./pages/Facility";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Facilities />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/facility/:id" element={<Facility />} />
      </Routes>
    </>
  );
}

export default App;
