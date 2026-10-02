

// import { createContext, useContext, useState } from "react";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(false);

//   return (
//     <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };
//  import { useContext } from "react";
// //import { AuthContext } from "../auth.context.jsx";
// import { login, register, logout, getMe } from "../services/auth.api.js";
// export const useAuth = () => {
//     const context = useContext(AuthContext)
//     const { user, setUser, loading, setLoading } = context

//     const handleLogin = async ({ email, password }) => {
//         setLoading(true)
//         try {
//             const data = await login({ email, password })
//             setUser(data.user)
//         } catch (err) {

//         } finally {
//             setLoading(false)
//         }
//     }
//     const handleRegister = async ({ username, email, password }) => {
//         setLoading(true)
//         try {
//             const data = await register({ username, email, password })
//             setUser(data.user)
//         } catch (err) {

//         } finally {
//             setLoading(false)
//         }
//         const handleLogout = async () => {
//             setLoading(true)
//             try {
//                 const data = await logout()
//                 setUser(null)
//             } catch (err) {

//             } finally {
//                 setLoading(false)
//             }
//             return { user, loading, handleRegister, handleLogin, handleLogout }
//         }
//     }
// }

import { createContext, useState,useEffect } from "react";

import { login, register, logout, getMe } from "./services/auth.api.js"; // Path update according to your folder structure

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await login({ email, password });
      const session = await getMe();
      if (!data?.user || !session?.user) {
        throw new Error(
          "Sign-in succeeded, but the session cookie was not accepted. Please try again."
        );
      }
      setUser(session.user);
      return session.user;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({ username, email, password }) => {
    setLoading(true);
    try {
      const data = await register({ username, email, password });
      const session = await getMe();
      if (!data?.user || !session?.user) {
        throw new Error(
          "Registration succeeded, but the session cookie was not accepted. Please sign in."
        );
      }
      setUser(session.user);
      return session.user;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      setUser(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
   useEffect(() => {
    const getAndSetUser = async()=>{
      try{
      const data = await getMe()
    setUser(data.user)
      }catch(err){}finally{
       setLoading(false)
      }
     
    }
    getAndSetUser()

  },[])


  return (
    <AuthContext.Provider
      value={{ user, loading, handleLogin, handleRegister, handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};