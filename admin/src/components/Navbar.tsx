import { IoMenuOutline, IoLogOutOutline } from "react-icons/io5";
import styles from "../assets/css/Navbar.module.css";

interface Props {
  onMenuBtnClick: () => void;
}

const Navbar: React.FC<Props> = ({ onMenuBtnClick }) => {
  return (
    <header className={styles.topbar}>
      <div className="group">
        <button
          className={`btn-icon ${styles.btnHeader} ${styles.btnMenu}`}
          onClick={onMenuBtnClick}
        >
          <IoMenuOutline size="1.5rem" />
        </button>
        <h1 className={styles.title}>CITY BREAK</h1>
      </div>
      <a href="/logout" role="button" className={`btn-icon ${styles.btnHeader}`}>
        <IoLogOutOutline size="1.5rem" />
      </a>
    </header>
  );
};

export default Navbar;
