import { SightTable } from "../components/Tables/SightTable";

export default function Dashboard() {
  return (
    <div className="container-fluid p-3">
      <div className="row gy-3 gx-0">
        <SightTable/>
      </div>
    </div>
  );
}
