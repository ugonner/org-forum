// <!-- Button trigger modal -->
// <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModalLong">
//   Launch demo modal
// </button>
import { useModalContextStore } from "./ModalContextProvider";
import "./modal.css";

import React, { useState } from "react";

export interface IComponentModalProps {
  modalTitle?: string;
  modalBody: React.ReactNode;
  showModalText: string;
}

export const ComponentModal = (prop: IComponentModalProps) => {
  const { showModalText, setShowModalText } = useModalContextStore();
  return (
    <div>
      (
      {showModalText === prop.showModalText && (
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
              </div>
              <div className="modal-body">
                <div style={{textAlign: "right"}}>
                  <span
                    role="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    onClick={() => setShowModalText("")}
                  >
                    <span aria-hidden="true">&times;</span>
                  </span>
                </div>
                {prop.modalBody ?? ""}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
