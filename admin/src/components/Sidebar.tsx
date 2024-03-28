import {
  IoBedOutline,
  IoBookOutline,
  IoBookmarksOutline,
  IoBusinessOutline,
  IoCalendarOutline,
  IoPersonCircle,
  IoRestaurantOutline,
  IoSpeedometerOutline,
  IoTrendingUpOutline,
  IoWalkOutline,
} from "react-icons/io5";

const Sidebar = () => {
  return (
    <aside>
      <header>
        <IoPersonCircle size="2rem" className="col-2" />
        <p id="user-fullname" className="col mb-0 fw-normal fs-5 text-truncate"></p>
      </header>
      <hr />
      <nav>
        <a href="/" className="nav-item active group">
          <IoSpeedometerOutline />
          <p>Dashboard</p>
        </a>
        <a href="/admin/tags" className="nav-item group">
          <IoBookmarksOutline />
          <p>Tags</p>
        </a>
        <a href="/admin/sights" className="nav-item group">
          <IoBusinessOutline />
          <p>Sights</p>
        </a>
        <a href="/admin/tours" className="nav-item group">
          <IoWalkOutline />
          <p>Tours</p>
        </a>
        <a href="/admin/restaurants" className="nav-item group">
          <IoRestaurantOutline />
          <p>Restaurants</p>
        </a>
        <a href="/admin/hotels" className="nav-item group">
          <IoBedOutline />
          <p>Accommodation</p>
        </a>
        <a href="/admin/events" className="nav-item group">
          <IoCalendarOutline />
          <p>Events</p>
        </a>
        <a href="/admin/trending" className="nav-item group">
          <IoTrendingUpOutline />
          <p>Trending</p>
        </a>
        <a href="/admin/about" className="nav-item group">
          <IoBookOutline />
          <p>About</p>
        </a>
      </nav>
      <hr />

      <section className="storage-info">
        <p>
          Server storage: <span id="space-used">0.0 GB</span> of{" "}
          <span id="space-total">0.0 GB</span> Used
        </p>
        <div className="bar-outline">
          <div className="bar-filled" id="storage-bar"></div>
        </div>
      </section>
    </aside>
  );
};

export default Sidebar;
