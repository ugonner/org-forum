// <!-- Button trigger modal -->
// <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModalLong">
//   Launch demo modal
// </button>
import "./modal.css"

import React, { useState } from "react";

export interface IComponentModalProps {
  modalTitle?: string;
  modalBody: React.ReactNode;
  isOpen: boolean;
  closeModal: Function
}

export const ComponentModal = (prop: IComponentModalProps) => {
  const [modalToggle, setModalToggle] = useState(true);

  return (
    <div>
      ({(prop.isOpen) && (
        <div
          className="comonent-modal bg-dark text-light col-sm-6 p-2"
          id="exampleModalLong"
          role="dialog"
          aria-labelledby="exampleModalLongTitle"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLongTitle">
                  {prop.modalTitle ?? ""}
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={() => prop.closeModal()}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">{prop.modalBody ?? ""}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
