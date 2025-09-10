import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "@/redux/authSlice";
import { authUtils } from "../../utils/authUtils";
import axios from "axios";
import { USER_API_END_POINT } from "../../utils/constant";

const ProtectedRoute = ({children, allowedRoles = []}) => {
    const {user} = useSelector(store=>store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(()=>{
        const checkUserStatus = async () => {
            if(!user || !authUtils.isAuthenticated()){
                navigate("/login");
                setIsChecking(false);
                return;
            }
            
            try {
                // Validate token and refresh if needed
                const isValid = await authUtils.validateToken();
                if (!isValid) {
                    navigate("/login");
                    setIsChecking(false);
                    return;
                }

                // Make a simple API call to check if user is still valid/not blocked
                const response = await axios.get(`${USER_API_END_POINT}/profile`, {
                    withCredentials: true
                });
                
                if(allowedRoles.length > 0 && !allowedRoles.includes(user.role)){
                    navigate("/");
                    setIsChecking(false);
                    return;
                }
                
                setIsChecking(false);
            } catch (error) {
                // If user is blocked, the axios interceptor will handle the redirect
                // If other error, clear user and redirect to login
                if (error.response?.status === 403 && error.response?.data?.blocked) {
                    // Let the axios interceptor handle this
                    return;
                }
                
                // For other errors, clear user data and redirect to login
                dispatch(setUser(null));
                authUtils.clearTokens();
                navigate("/login");
                setIsChecking(false);
            }
        };

        checkUserStatus();
    },[user, allowedRoles, navigate, dispatch]);

    if(!user || isChecking) return null;

    return (
        <>
        {children}
        </>
    )
};

export default ProtectedRoute;