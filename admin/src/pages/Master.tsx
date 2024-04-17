import {
  IoCreateOutline,
  IoEyeOffOutline,
  IoEyeOutline,
  IoLogOutOutline,
  IoRemoveCircleOutline,
} from "react-icons/io5";
import navbarStyles from "../assets/css/Navbar.module.css";
import layoutStyles from "../assets/css/Layout.module.css";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import Card from "../components/Card";
import { useEffect, useRef, useState } from "react";
import TableCard from "../components/TableCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { City } from "../models/CityModel";
import { User } from "../models/UserModel";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

export default function MasterPage() {
  const { logout, user } = useAuth();
  const modalRef = useRef<HTMLDivElement>(null);
  const [isLoading, setLoading] = useState(true);
  const [cities, setCities] = useState<Array<City>>([]);
  const [users, setUsers] = useState<Array<User>>([]);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    setLoading(true);

    const users: Array<User> = await fetch("/api/fetchAdminUsers").then(response =>
      response.json(),
    );

    const cities: Array<City> = await Promise.all(
      users.map(user =>
        fetch("/api/findCity/" + user.city_id).then(response => response.json()),
      ),
    );

    setUsers(users);
    setCities(cities);
    setLoading(false);
  };

  const deleteCity = async (id: string) => {
    console.log("/api/deleteCity/" + id);
    if (confirm("Are you sure you want to delete the city")) {
      await fetch("/api/deleteCity/" + id, { method: "DELETE" });
      await fetchCities();
    }
  };

  const openEditModal = (id: string) => {
    modalRef.current!.dataset.user_id = id;
  };

  const logoutBtnHandler = () => {
    fetch("/api/logout", {
      method: "POST",
    }).then(() => {
      logout();
    });
  };

  if (!user || user.username !== "master") {
    return <Navigate to="/login" />;
  }

  return (
    <div className={`${layoutStyles.panel_nosidebar}`}>
      <header className={navbarStyles.topbar}>
        <h1 className={navbarStyles.title}>CITY BREAK</h1>

        <button
          onClick={logoutBtnHandler}
          role="button"
          className={`btn-icon ${navbarStyles.btnHeader}`}
        >
          <IoLogOutOutline size="1.5rem" />
        </button>
      </header>
      <main className="d-flex">
        <div className="container-md m-auto py-3">
          <div className="row justify-content-center gx-4 gy-3">
            <div className="col-sm-5">
              <Card title="Insert city">
                <InsertCityForm cities={cities} fetchCities={fetchCities} />
              </Card>
            </div>
            <div className="col-sm-7">
              <TableCard title="Cities" records={cities.length}>
                <table className={`${isLoading && "h-100"}`}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Full name</th>
                      <th>Username</th>
                      <th>City</th>
                      <th>State</th>
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
                        {users.map((user, index) => {
                          const city = cities[index];

                          return (
                            <tr key={index}>
                              <td className="small-cell">{index + 1}</td>
                              <td>{user.fullname}</td>
                              <td>{user.username}</td>
                              <td>{city.name}</td>
                              <td>{city.state}</td>
                              <td className="small-cell text-center">
                                <div className="group">
                                  <button
                                    className="btn-icon"
                                    data-bs-toggle="modal"
                                    data-bs-target="#modal"
                                    onClick={() => openEditModal(user._id)}
                                  >
                                    <IoCreateOutline className="edit-icon" />
                                  </button>
                                  <button
                                    className="btn-icon"
                                    onClick={() => deleteCity(city.city_id)}
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
            </div>
          </div>
        </div>
      </main>
      <EditPasswordModal modalRef={modalRef} />
    </div>
  );
}

interface InsertCityFormProps {
  cities: City[];
  fetchCities: () => Promise<void>;
}

const InsertCityForm: React.FC<InsertCityFormProps> = ({ cities, fetchCities }) => {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword(!showPassword);

  const {
    register,
    formState: { isSubmitting },
    handleSubmit,
    reset,
  } = useForm();

  const onSubmit: SubmitHandler<FieldValues> = async data => {
    if (cities.filter(c => c.name == data.name && c.state == data.state).length > 0) {
      alert("City already exists");
      return;
    }

    await fetch("/api/insertCity", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json; charset=UTF-8" },
    });

    await fetchCities();
    reset();
  };

  return (
    <form id="insert-city-form" className="row g-3" onSubmit={handleSubmit(onSubmit)}>
      <section className="col-12">
        <label htmlFor="city-name" className="form-label">
          Name
        </label>
        <input
          type="text"
          id="city-name"
          className="form-control"
          required
          {...register("name")}
        />
      </section>
      <section className="col-12">
        <label htmlFor="city-state" className="form-label">
          State/Province
        </label>
        <input
          type="text"
          id="city-state"
          className="form-control"
          required
          {...register("state")}
        />
      </section>
      <section className="col-12 form-text">
        <hr />
        Administrator account:
      </section>
      <section className="col-12">
        <label htmlFor="fullname" className="form-label">
          Full name
        </label>
        <input
          type="text"
          id="fullname"
          className="form-control"
          spellCheck="false"
          autoCorrect="off"
          autoCapitalize="off"
          maxLength={22}
          required
          {...register("fullname")}
        />
      </section>
      <section className="col-12">
        <label htmlFor="username" className="form-label">
          Username
        </label>
        <input
          type="text"
          id="username"
          className="form-control"
          spellCheck="false"
          autoCorrect="off"
          autoCapitalize="off"
          required
          {...register("username")}
        />
      </section>
      <section className="col-12">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <div className="input-group">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            className="form-control rounded-end"
            spellCheck="false"
            autoCorrect="off"
            autoCapitalize="off"
            autoComplete="new-password"
            maxLength={20}
            required
            {...register("password")}
          />

          {showPassword ? (
            <IoEyeOutline className="eye-icon" onClick={toggleShowPassword} />
          ) : (
            <IoEyeOffOutline className="eye-icon" onClick={toggleShowPassword} />
          )}
        </div>
      </section>
      <section className="col-12">
        <button
          type="submit"
          className={`btn btn-primary ${isSubmitting && "loading-btn"}`}
        >
          <span>Insert</span>
        </button>
      </section>
    </form>
  );
};

interface EditPasswordModalProps {
  modalRef: React.RefObject<HTMLDivElement>;
}

const EditPasswordModal: React.FC<EditPasswordModalProps> = ({ modalRef }) => {
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword(!showPassword);

  const closeModal = () => window.bootstrap.Modal.getInstance(modalRef.current!)?.hide();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(newPassword);

    await fetch("/api/editUserPassword/" + modalRef.current!.dataset.user_id, {
      method: "PUT",
      body: JSON.stringify({ new_password: newPassword }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    closeModal();

    const form = e.target as HTMLFormElement;
    form.reset();
  };

  return (
    <div
      ref={modalRef}
      className="modal fade"
      id="modal"
      tabIndex={-1}
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit user account</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <form id="edit-user-form" className="row g-3" onSubmit={onSubmit}>
              <section className="col-12">
                <label htmlFor="new-password" className="form-label">
                  New password
                </label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="new-password"
                    className="form-control rounded-end"
                    spellCheck="false"
                    autoCorrect="off"
                    autoCapitalize="off"
                    autoComplete="new-password"
                    name="new-password"
                    maxLength={20}
                    onChange={e => setNewPassword(e.currentTarget.value)}
                    required
                  />

                  {showPassword ? (
                    <IoEyeOutline className="eye-icon" onClick={toggleShowPassword} />
                  ) : (
                    <IoEyeOffOutline className="eye-icon" onClick={toggleShowPassword} />
                  )}
                </div>
              </section>
              <section className="col-12">
                <button type="submit" className="btn btn-primary">
                  <span>Update</span>
                </button>
              </section>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
