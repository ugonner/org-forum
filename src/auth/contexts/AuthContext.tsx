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
    const localUser = JSON.parse(`${localStorage.getItem("user")}`);
    const hasAdminRole = /admin/i.test(JSON.stringify(localUser?.role))
    const [isAnAdmin, setIsAnAdmin] = useState(hasAdminRole);
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