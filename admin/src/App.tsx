import { Outlet } from "react-router-dom";
import "./assets/css/styles.css";

export default function App() {
    return (
      <>
        <h1>Navbar</h1>
        <Outlet/>
      </>
    );
  }
  