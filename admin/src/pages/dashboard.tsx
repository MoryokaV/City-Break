import { useEffect, useRef, useState } from "react";
import { Modal } from "../components/Modal";
import { SightTable } from "../components/Tables/SightTable";
import { TourTable } from "../components/Tables/TourTable";
import { RestaurantTable } from "../components/Tables/RestaurantTable";

export default function Dashboard() {
  const modalRef = useRef<HTMLDivElement>(null);
  const [modalContent, setModalContent] = useState(<></>);

  const clearModal = () => setModalContent(<></>);

  const closeModal = () => window.bootstrap.Modal.getInstance(modalRef.current!)?.hide();

  useEffect(() => {
    modalRef.current?.addEventListener("hidden.bs.modal", clearModal);

    return () => {
      modalRef.current?.removeEventListener("hidden.bs.modal", clearModal);
    };
  }, []);

  return (
    <>
      <div className="container-fluid p-3">
        <div className="row gy-3 gx-0">
          <SightTable setModalContent={setModalContent} closeModal={closeModal} />
          <TourTable setModalContent={setModalContent} closeModal={closeModal} />
          <RestaurantTable setModalContent={setModalContent} closeModal={closeModal} />
        </div>
      </div>
      <Modal modalRef={modalRef}>{modalContent}</Modal>
    </>
  );
}
