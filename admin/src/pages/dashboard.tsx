import { useState } from "react";
import { Modal } from "../components/Modal";
import { SightTable } from "../components/Tables/SightTable";

export default function Dashboard() {
  const [modalContent, setModalContent] = useState(<></>);

  return (
    <>
      <div className="container-fluid p-3">
        <div className="row gy-3 gx-0">
          <SightTable onEditClick={setModalContent} />
        </div>
      </div>
      <Modal>{modalContent}</Modal>
    </>
  );
}
