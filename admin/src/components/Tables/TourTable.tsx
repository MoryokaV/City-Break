import { useEffect, useState } from "react";
import DashboardCard from "../DashboardCard";
import { IoCreateOutline, IoRemoveCircleOutline } from "react-icons/io5";
import { Tour } from "../../models/TourModel";
import { LoadingSpinner } from "../LoadingSpinner";

export const TourTable = () => {
  const [isLoading, setLoading] = useState(true);
  const [tours, setTours] = useState<Array<Tour>>([]);

  useEffect(() => {
    fetch(
      "/api/fetchTours?city_id=5331e6c5772d490dabeb124502b96882",
    )
      .then(response => response.json())
      .then(data => {
        setTours(data);
        setLoading(false);
      });
  }, []);

  return (
    <DashboardCard title="Tours" records={tours.length}>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Stages</th>
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
              {tours.map((tour, index) => {
                return (
                  <tr key={index}>
                    <td>{tour._id}</td>
                    <td>{tour.name}</td>
                    <td>{tour.stages.map(stage => stage.text).join(" - ")}</td>
                    <td>
                      <a href={tour.external_link} target="_blank">
                        {tour.external_link}
                      </a>
                    </td>
                    <td id={tour._id}>
                      <div className="group">
                        <button
                          className="btn-icon action-edit-tour"
                          data-bs-toggle="modal"
                          data-bs-target="#tour-modal"
                        >
                          <IoCreateOutline className="edit-icon" />
                        </button>
                        <button className="btn-icon action-delete-tour">
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
