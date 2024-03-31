import { ReactNode } from "react";

interface Props {
  title: string;
  records: number;
  children: ReactNode;
}

const DashboardCard: React.FC<Props> = ({ title, records, children }) => {
  return (
    <div className="card shadow-sm dashboard-card">
      <h5 className="card-header d-flex justify-content-between align-items-baseline">
        {title}
        <p>{records} records</p>
      </h5>
      <div className="card-body table-card-body">{children}</div>
    </div>
  );
};

export default DashboardCard;