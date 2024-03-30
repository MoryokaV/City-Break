import { useRouteError } from "react-router-dom";
import styles from "../assets/css/404.module.css";
import NotFoundSVG from "../assets/illustrations/not_found.svg";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <div className={`d-flex flex-column align-items-center justify-content-center w-100 h-100 p-4 ${styles.fill_root}`}>
      <img src={NotFoundSVG} alt="Not found illustration" className={styles.icon} />
      <h1>Oops!</h1>
      <p className={styles.info}>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>
          {(error as Error)?.message || (error as { statusText?: string })?.statusText}
        </i>
      </p>
    </div>
  );
}
