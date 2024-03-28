import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";
import "./assets/css/panel.css";
import "./assets/css/styles.css";

export default function App() {
  return (
    <>
      <Sidebar />
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}
