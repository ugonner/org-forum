import React, { Children, createContext, useContext, useState } from "react";

export interface IModalContextStore {
    setShowModalText: React.Dispatch<React.SetStateAction<string>>;
    showModalText: string;
    setShowPopoverId: React.Dispatch<React.SetStateAction<string>>;
    showPopoverId: string;
}
const ModalContext = createContext({} as IModalContextStore);

export const ModalContextProvider = ({children}: React.PropsWithChildren) => {
    const [showModalText, setShowModalText] = useState("");
    const [showPopoverId, setShowPopoverId] = useState("");
    return (
        <ModalContext.Provider value={{showModalText, setShowModalText, setShowPopoverId, showPopoverId}}>
            {children}
        </ModalContext.Provider>
    )
}

export const useModalContextStore = () => useContext(ModalContext)