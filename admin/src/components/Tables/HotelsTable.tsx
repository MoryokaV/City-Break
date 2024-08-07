import { useEffect, useState } from "react";
import TableCard from "../TableCard";
import { IoCreateOutline, IoRemoveCircleOutline } from "react-icons/io5";
import { LoadingSpinner } from "../LoadingSpinner";
import { useAuth } from "../../hooks/useAuth";
import { Hotel } from "../../models/HotelModel";
import { EditHotelForm } from "../Forms/EditHotelForm";
import Sortable from "sortablejs";

interface Props {
  setModalContent: React.Dispatch<React.SetStateAction<JSX.Element>>;
  closeModal: () => void;
}

export const HotelsTable: React.FC<Props> = ({ setModalContent, closeModal }) => {
  const { user } = useAuth();
  const [isLoading, setLoading] = useState(true);
  const [hotels, setHotels] = useState<Array<Hotel>>([]);

  useEffect(() => {
    fetch("/api/fetchHotels?city_id=" + user?.city_id)
      .then(response => response.json())
      .then(data => {
        setHotels(data);
        setLoading(false);
      });

    const list = document.querySelector<HTMLElement>("#hotels-table tbody")!;

    new Sortable(list, {
      animation: 150,
      easing: "cubic-bezier(0.65, 0, 0.35, 1)",
      delay: 200,
      delayOnTouchOnly: true,
      draggable: "tr",
      onEnd: async function (e) {
        const items: Array<string> = [];

        for (
          let i = Math.min(e.oldIndex!, e.newIndex!);
          i <= Math.max(e.oldIndex!, e.newIndex!);
          i++
        ) {
          items.push(document.querySelectorAll("#hotels-table tbody tr")![i].id);
        }

        await fetch("/api/updateHotelIndex", {
          method: "PUT",
          body: JSON.stringify({
            oldIndex: e.oldIndex,
            newIndex: e.newIndex,
            items: items,
          }),
          headers: { "Content-Type": "application/json; charset=UTF-8" },
        });
      },
    });
  }, []);

  const deleteHotel = (id: string) => {
    if (confirm("Are you sure you want to delete the entry")) {
      fetch("/api/deleteHotel/" + id, { method: "DELETE" });
      setHotels(hotels.filter(hotel => hotel._id !== id));
    }
  };

  const updateTable = (updatedHotel: Hotel) => {
    const index = hotels.findIndex(hotel => hotel._id === updatedHotel._id);
    hotels[index] = updatedHotel;

    setHotels(hotels);
  };

  return (
    <TableCard title="Accommodation" records={hotels.length}>
      <table id="hotels-table" className={`${isLoading && "h-100"}`}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Stars</th>
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
              {hotels.map((hotel, index) => {
                return (
                  <tr id={hotel._id} key={index}>
                    <td>{hotel._id}</td>
                    <td>{hotel.name}</td>
                    <td className="stars">{"★".repeat(hotel.stars)}</td>
                    <td>{hotel.tags.join(", ")}</td>
                    <td>
                      <a href={hotel.external_link} target="_blank">
                        {hotel.external_link}
                      </a>
                    </td>
                    <td>
                      <div className="group">
                        <button
                          className="btn-icon"
                          data-bs-toggle="modal"
                          data-bs-target="#modal"
                          onClick={() =>
                            setModalContent(
                              <EditHotelForm
                                hotel={hotel}
                                updateTable={updateTable}
                                closeModal={closeModal}
                              />,
                            )
                          }
                        >
                          <IoCreateOutline className="edit-icon" />
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => deleteHotel(hotel._id)}
                        >
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
    </TableCard>
  );
};
