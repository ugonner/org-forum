import React, { SetStateAction, useContext, useState } from "react";

export interface IAuthContextStore {
    isLoggedIn: boolean;
    isAnAdmin: boolean;
    login: () => void;
    logOut: () => void;
    setIsAnAdmin: React.Dispatch<SetStateAction<boolean>>
}

const AuthContext = React.createContext<IAuthContextStore>({} as IAuthContextStore)

export const AuthProvider = ({children}: React.PropsWithChildren ) => {
    const token = localStorage.getItem("token");
    const [isAnAdmin, setIsAnAdmin] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState( token ? true : false)
    
    const login = () => setIsLoggedIn(true);
    const logOut = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
    }
    
    const initialStore = {
        isLoggedIn,
        isAnAdmin,
        login,
        logOut,
        setIsAnAdmin
    }
    
    return (
        <AuthContext.Provider value={initialStore}>{children}</AuthContext.Provider>
    )
}

export const useAuthContextStore = () => useContext(AuthContext)