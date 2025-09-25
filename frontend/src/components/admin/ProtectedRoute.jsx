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
                // If we don't have tokens, redirect immediately
                if (!authUtils.isAuthenticated()) {
                    navigate("/login");
                    setIsChecking(false);
                    return;
                }

                // Hydrate user from storage or API if missing
                let currentUser = user;
                if (!currentUser) {
                    const storedUser = authUtils.getUser();
                    if (storedUser) {
                        dispatch(setUser(storedUser));
                        currentUser = storedUser;
                    } else {
                        // Fetch profile to hydrate
                        const prof = await axios.get(`${USER_API_END_POINT}/profile`, { withCredentials: true });
                        if (prof.data?.success && prof.data.user) {
                            dispatch(setUser(prof.data.user));
                            currentUser = prof.data.user;
                        }
                    }
                }

                // Validate token and refresh if needed
                const isValid = await authUtils.validateToken();
                if (!isValid) {
                    navigate("/login");
                    setIsChecking(false);
                    return;
                }

                // Ensure user is still active/not blocked via lightweight call
                await axios.get(`${USER_API_END_POINT}/profile`, { withCredentials: true });

                // Role check after hydration
                if (allowedRoles.length > 0 && currentUser && !allowedRoles.includes(currentUser.role)) {
                    navigate("/");
                    setIsChecking(false);
                    return;
                }

                setIsChecking(false);
            } catch (error) {
                // If user is blocked, the axios interceptor will handle the redirect
                if (error.response?.status === 403 && error.response?.data?.blocked) {
                    return;
                }
                // Any other error -> clear and redirect
                dispatch(setUser(null));
                authUtils.clearTokens();
                navigate("/login");
                setIsChecking(false);
            }
        };

        checkUserStatus();
        // Only re-run when route role requirements change or auth user pointer changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[allowedRoles, navigate, dispatch, user]);

    if(isChecking) return null;

    return (
        <>
        {children}
        </>
    )
};

export default ProtectedRoute;