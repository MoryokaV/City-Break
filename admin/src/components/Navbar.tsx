import { IoMenuOutline, IoLogOutOutline } from "react-icons/io5";

interface Props {
  onMenuBtnClick: () => void;
}

const Navbar: React.FC<Props> = ({ onMenuBtnClick }) => {
  return (
    <header>
      <div className="group">
        <button
          className="btn-icon menu-btn btn-header"
          onClick={onMenuBtnClick}
        >
          <IoMenuOutline size="1.5rem" />
        </button>
        <h1 className="title title-long">CITY BREAK</h1>
      </div>
      <a href="/logout" role="button" className="btn-icon btn-header">
        <IoLogOutOutline size="1.5rem" />
      </a>
    </header>
  );
};

export default Navbar;
