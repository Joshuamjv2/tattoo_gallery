import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/hooks/Auth";
import LoadingModal from "../components/common/Loading";
const ProtectedRoutes = () => {
    const { currentUser, loading } = useAuth();


    if (loading) {
        return <div><LoadingModal /></div>;
    }

    console.log("Protected routes being called")

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoutes;
