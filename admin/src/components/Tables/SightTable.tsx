import { useEffect, useState } from "react";
import DashboardCard from "../DashboardCard";
import { IoCreateOutline, IoRemoveCircleOutline } from "react-icons/io5";
import { Sight } from "../../models/SightModel";
import { LoadingSpinner } from "../LoadingSpinner";
import { useAuth } from "../../hooks/useAuth";
import { SightForm } from "../Forms/SightForm";

interface Props {
  onEditClick: (content: React.ReactElement) => void;
}

export const SightTable: React.FC<Props> = ({ onEditClick }) => {
  const { user } = useAuth();
  const [isLoading, setLoading] = useState(true);
  const [sights, setSights] = useState<Array<Sight>>([]);

  useEffect(() => {
    fetch("/api/fetchSights?city_id=" + user?.city_id)
      .then(response => response.json())
      .then(data => {
        setSights(data);
        setLoading(false);
      });
  }, [user?.city_id]);

  return (
    <DashboardCard title="Sights" records={sights.length}>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Tags</th>
            <th>External link</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={100} className="my-auto text-center">
                <LoadingSpinner />
              </td>
            </tr>
          ) : (
            <>
              {sights.map((sight, index) => {
                return (
                  <tr key={index}>
                    <td>{sight._id}</td>
                    <td>{sight.name}</td>
                    <td>{sight.tags.join(", ")}</td>
                    <td>
                      <a href={sight.external_link} target="_blank">
                        {sight.external_link}
                      </a>
                    </td>
                    <td id={sight._id}>
                      <div className="group">
                        <button
                          className="btn-icon action-edit-sight"
                          data-bs-toggle="modal"
                          data-bs-target="#modal"
                          onClick={() => onEditClick(<SightForm key={Math.random()} />)}
                        >
                          <IoCreateOutline className="edit-icon" />
                        </button>
                        <button className="btn-icon action-delete-sight">
                          <IoRemoveCircleOutline className="edit-icon" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </>
          )}
        </tbody>
      </table>
    </DashboardCard>
  );
};
