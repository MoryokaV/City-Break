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
import { useEffect, useState } from "react";
import TableCard from "../components/TableCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { City } from "../models/CityModel";
import { User } from "../models/UserModel";

export default function MasterPage() {
  const { logout, user } = useAuth();
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
                <InsertCityForm />
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
                          return (
                            <tr key={index}>
                              <td className="small-cell">{index + 1}</td>
                              <td>{user.fullname}</td>
                              <td>{user.username}</td>
                              <td>{cities[index].name}</td>
                              <td>{cities[index].state}</td>
                              <td className="small-cell text-center">
                                <div className="group">
                                  <button
                                    className="btn-icon"
                                    data-bs-toggle="modal"
                                    data-bs-target="#modal"
                                    // onClick={() =>
                                    //   setModalContent(
                                    //     <EditSightForm
                                    //       sight={sight}
                                    //       updateTable={updateTable}
                                    //       closeModal={closeModal}
                                    //     />,
                                    //   )
                                    // }
                                  >
                                    <IoCreateOutline className="edit-icon" />
                                  </button>
                                  <button
                                    className="btn-icon"
                                    // onClick={() => deleteSight(sight._id)}
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
    </div>
  );
}

const InsertCityForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <form id="insert-city-form" className="row g-3">
      <section className="col-12">
        <label htmlFor="city-name" className="form-label">
          Name
        </label>
        <input
          type="text"
          id="city-name"
          className="form-control"
          name="city-name"
          required
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
          name="city-state"
          required
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
          name="fullname"
          maxLength={22}
          required
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
          name="username"
          required
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
            name="password"
            maxLength={20}
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
          <span>Insert</span>
        </button>
      </section>
    </form>
  );
};
