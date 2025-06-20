import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({children, allowedRoles = []}) => {
    const {user} = useSelector(store=>store.auth);
    const navigate = useNavigate();

    useEffect(()=>{
        if(user === null){
            navigate("/login");
            return;
        }
        
        if(allowedRoles.length > 0 && !allowedRoles.includes(user.role)){
            navigate("/");
            return;
        }
    },[user, allowedRoles, navigate]);

    if(!user) return null;

    return (
        <>
        {children}
        </>
    )
};

export default ProtectedRoute;