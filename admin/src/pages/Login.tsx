import { IoEyeOffOutline } from "react-icons/io5";
import styles from "../assets/css/Login.module.css";
import icon from "../assets/icon.png";

export default function Login() {
  return (
    <div className={styles.background}>
      <main className={styles.content}>
        <div className="row g-0">
          <div className="col-sm-6">
            <div className={styles.sideImg}></div>
          </div>
          <div className="col-sm-6">
            <form className={styles.formLogin}>
              <img className="mb-2 img-fluid" src={icon} width="128" height="128" />
              <h2 className="mb-4 fw-medium">CITY BREAK</h2>
              <section className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  spellCheck="false"
                  autoCorrect="off"
                  autoCapitalize="off"
                  autoComplete="username"
                  id="user"
                  name="user"
                  placeholder="user"
                  required
                  style={{
                    marginBottom: "-1px",
                    borderBottomLeftRadius: "0",
                    borderBottomRightRadius: "0",
                  }}
                />
                <label className="floatingInput">Username</label>
              </section>

              <section className="form-floating">
                <input
                  type="password"
                  className="form-control"
                  spellCheck="false"
                  autoCorrect="off"
                  autoCapitalize="off"
                  autoComplete="current-password"
                  id="pass"
                  name="pass"
                  placeholder="password"
                  maxLength={20}
                  required
                  style={{
                    marginBottom: "10px",
                    borderTopLeftRadius: "0",
                    borderTopRightRadius: "0",
                  }}
                />
                <IoEyeOffOutline className={styles.eyeIcon} />
                {/* <ion-icon name="eye-off-outline" class="eye-icon"></ion-icon> */}
                <label className="floatingInput">Password</label>
              </section>

              <button
                type="submit"
                className={`w-100 mt-2 btn btn-lg btn-primary fw-medium fs-6 ${styles.trackingWide}`}
              >
                LOGIN
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
