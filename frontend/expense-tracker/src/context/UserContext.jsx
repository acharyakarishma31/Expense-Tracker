

import React, {createContext, useState} from 'react';

export const UserContext = createContext();


const UserProvider = ({children}) => {
    // Load user from localStorage on initial render
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    // Function to update user info and persist to localStorage
    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    // Function to clear user data (eg. on logout)
    const clearUser = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token'); // Also clear token if needed
    };

    return (
        <UserContext.Provider value={{user, updateUser, clearUser}}>
            {children}
        </UserContext.Provider>
    );
};
export default UserProvider;
 