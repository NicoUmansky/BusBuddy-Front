import React, { createContext, useContext, useState } from 'react';
const UserContext = createContext({ userId: null, setUserId: () => {}});

export function UserProvider({ children }) {
  const [userId, setUserId] = useState(null);

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(){
    const context = useContext(UserContext);
    return context;
}