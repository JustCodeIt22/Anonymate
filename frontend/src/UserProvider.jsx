import React, { createContext, useEffect, useState } from 'react'

export const UserContext = createContext(null);

const UserProvider = (props) => {
  const [userId, setUserId] = useState("");
  const [allMessages, setAllMessages] = useState([]);

  const generateID = () => {
    const generatedUserID = Math.random().toString(36).substring(2, 7);
    setUserId(generatedUserID);
  };

  return (
    <UserContext.Provider value={{userId, generateID, allMessages, setAllMessages}}>
      {props.children}
    </UserContext.Provider>
  )
}

export default UserProvider