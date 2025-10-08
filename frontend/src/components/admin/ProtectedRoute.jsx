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
            try {
                if (!authUtils.isAuthenticated()) {
                    navigate("/login");
                    setIsChecking(false);
                    return;
                }
                let currentUser = user;
                if (!currentUser) {
                    const storedUser = authUtils.getUser();
                    if (storedUser) {
                        dispatch(setUser(storedUser));
                        currentUser = storedUser;
                    } else {
                        
                        const prof = await axios.get(`${USER_API_END_POINT}/profile`, { withCredentials: true });
                        if (prof.data?.success && prof.data.user) {
                            dispatch(setUser(prof.data.user));
                            currentUser = prof.data.user;
                        }
                    }
                }

                
                const isValid = await authUtils.validateToken();
                if (!isValid) {
                    navigate("/login");
                    setIsChecking(false);
                    return;
                }

                
                await axios.get(`${USER_API_END_POINT}/profile`, { withCredentials: true });

          
                if (allowedRoles.length > 0 && currentUser && !allowedRoles.includes(currentUser.role)) {
                    navigate("/");
                    setIsChecking(false);
                    return;
                }

                setIsChecking(false);
            } catch (error) {
                
                if (error.response?.status === 403 && error.response?.data?.blocked) {
                    return;
                }
               
                dispatch(setUser(null));
                authUtils.clearTokens();
                navigate("/login");
                setIsChecking(false);
            }
        };

        checkUserStatus();
  
    },[allowedRoles, navigate, dispatch, user]);

    if(isChecking) return null;

    return (
        <>
        {children}
        </>
    )
};

export default ProtectedRoute;