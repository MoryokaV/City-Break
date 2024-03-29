import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";
import "./assets/css/panel.css";
import "./assets/css/styles.css";
import { useState, useRef, useEffect } from "react";

export default function App() {
  const [showSidebar, setShowSidebar] = useState(false);

  const sidebarRef = useRef<HTMLElement>(null);

  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const closeSidebar = () => setShowSidebar(false);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (
        showSidebar &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        closeSidebar();
      }
    };

    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [showSidebar]);

  return (
    <>
      <Sidebar show={showSidebar} sidebarRef={sidebarRef} />
      <Navbar onMenuBtnClick={toggleSidebar} />
      <main>
        <Outlet />
      </main>
    </>
  );
}
