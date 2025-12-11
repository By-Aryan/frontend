const { createContext, useContext } = require("react");

export const userContext = createContext();

export const UserContextProvider = userContext.Provider
