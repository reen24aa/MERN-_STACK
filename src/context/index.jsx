import {useContext,useState, useEffect} from "react";
import{auth} from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext=React.createContext();

export function useAuth(){
    return useContext(AuthContext);
}
export function AuthProvider({children}){
    const [currentUser, setCurrentUser]=useState(null);
    const [userLoggedIn, setUserLoggedIn]=useState(false);
    const[loading, setLoading]=useState(true);

    useEffect(()=>{
        const unsubscribe=onAuthStateChanged(auth, initializeUser);
        return unsubscribe;
    },[])
    async function initializeUser(user) {
        setCurrentUser(user ? { ...user } : null);
        setUserLoggedIn(!!user);
        setLoading(false);
    }
    
    const value = {
        currentUser,
        userLoggedIn,
        loading,
        signIn, // function to sign in
        signOut // function to sign out
    };
    
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )

}