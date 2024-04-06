import { useEffect, useRef, useState } from "react";
import { Modal } from "../components/Modal";
import { SightTable } from "../components/Tables/SightTable";

export default function Dashboard() {
  // const modalRef = useRef<HTMLDivElement>(null);
  const [modalContent, setModalContent] = useState(<></>);

  // const clearModal = () => {
  //   setModalContent(<></>);
  // };

  // useEffect(() => {
  //   modalRef.current?.addEventListener("hidden.bs.modal", clearModal);

  //   return () => {
  //     modalRef.current?.removeEventListener("hidden.bs.modal", clearModal);
  //   };
  // }, []);

  return (
    <>
      <div className="container-fluid p-3">
        <div className="row gy-3 gx-0">
          <SightTable onEditClick={setModalContent} />
        </div>
      </div>
      <Modal >{modalContent}</Modal>
    </>
  );
}
