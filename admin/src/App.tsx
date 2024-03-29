import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";
import "./assets/css/panel.css";
import "./assets/css/styles.css";
import { useState } from "react";

export default function App() {
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const closeSidebar = () => setShowSidebar(false);

  return (
    <>
      <Sidebar show={showSidebar} closeSidebar={closeSidebar} />
      <Navbar onMenuBtnClick={toggleSidebar} />
      <main>
        <Outlet />
      </main>
    </>
  );
}
