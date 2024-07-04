import React, { createContext, useState, useContext } from 'react';

// Crear contexto para el usuario
const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Aquí guardaremos el usuario logueado

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

// Hook para usar el contexto del usuario
export const useUser = () => {
    return useContext(UserContext);
};