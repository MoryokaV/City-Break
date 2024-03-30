import { SightTable } from "../components/Tables/SightTable";
import { TourTable } from "../components/Tables/TourTable";

export default function Dashboard() {
  return (
    <div className="container-fluid p-3">
      <div className="row gy-3 gx-0">
        <SightTable />
        <TourTable />
      </div>
    </div>
  );
}
