import { ReactElement } from "react";
import {
  IoBedOutline,
  IoBookOutline,
  IoBookmarksOutline,
  IoBusinessOutline,
  IoCalendarOutline,
  IoRestaurantOutline,
  IoSpeedometerOutline,
  IoTrendingUpOutline,
  IoWalkOutline,
} from "react-icons/io5";

type SidebarItem = {
  name: string;
  path: string;
  icon: ReactElement;
};

export const SidebarData: Array<SidebarItem> = [
  {
    name: "Dashboard",
    path: "/",
    icon: <IoSpeedometerOutline />,
  },
  {
    name: "Tags",
    path: "/tags",
    icon: <IoBookmarksOutline />,
  },
  {
    name: "Sights",
    path: "/sights",
    icon: <IoBusinessOutline />,
  },
  {
    name: "Tours",
    path: "/tours",
    icon: <IoWalkOutline />,
  },
  {
    name: "Restaurants",
    path: "/restauants",
    icon: <IoRestaurantOutline />,
  },
  {
    name: "Hotels",
    path: "/hotel",
    icon: <IoBedOutline />,
  },
  {
    name: "Events",
    path: "/events",
    icon: <IoCalendarOutline />,
  },
  {
    name: "Trending",
    path: "/trending",
    icon: <IoTrendingUpOutline />,
  },
  {
    name: "About",
    path: "/about",
    icon: <IoBookOutline />,
  },
];

