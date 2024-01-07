import React from "react";

const UserContext = React.createContext({_id: "",email: "",role: "", auth: false });

const UserProvider = ({ children }) => {
  const [user, setUser] = React.useState({_id:"",email: "",role:"",auth: false });

  const loginContext = (id,email,token,role) => {
    setUser((user) => ({
      id: id,
      email: email,
      role: role,
      auth: true,
    }));
    localStorage.setItem("id",id); 
    localStorage.setItem("token",token);
    localStorage.setItem("role",role);
    localStorage.setItem("email",email); 
  };

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("id")
    setUser((user) => ({
      id:"",
      email: "",
      role: "",
      auth: false,
    }));
  };
  return (
    <UserContext.Provider value={{ user, loginContext, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
