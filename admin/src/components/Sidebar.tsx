import { ReactElement, RefObject } from "react";
import { NavLink } from "react-router-dom";
import { IoPersonCircle } from "react-icons/io5";
import { SidebarData } from "../data/SidebarData";

interface SidebarProps {
  show: boolean;
  sidebarRef: RefObject<HTMLElement>;
}

const Sidebar: React.FC<SidebarProps> = ({ show, sidebarRef }) => {
  return (
    <aside ref={sidebarRef} className={`${show ? "show" : ""}`}>
      <header>
        <IoPersonCircle size="2rem" className="col-2" />
        <p id="user-fullname" className="col mb-0 fw-normal fs-5 text-truncate"></p>
      </header>
      <hr />
      <nav>
        {SidebarData.map((item, index) => {
          return (
            <NavItem path={item.path} icon={item.icon} key={index}>
              {item.name}
            </NavItem>
          );
        })}
      </nav>
      <hr />
      <StorageInfo />
    </aside>
  );
};

interface NavItemProps {
  path: string;
  icon: ReactElement;
  children: string;
}

const NavItem: React.FC<NavItemProps> = ({ path, icon, children }) => {
  return (
    <NavLink
      to={path}
      className={({ isActive }) => (isActive ? "active" : "") + " nav-item group"}
    >
      {icon}
      <p>{children}</p>
    </NavLink>
  );
};

const StorageInfo = () => {
  return (
    <section className="storage-info">
      <p>
        Server storage: <span id="space-used">0.0 GB</span> of{" "}
        <span id="space-total">0.0 GB</span> Used
      </p>
      <div className="bar-outline">
        <div className="bar-filled" id="storage-bar"></div>
      </div>
    </section>
  );
};

export default Sidebar;
