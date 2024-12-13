import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const isAuthenticated = sessionStorage.getItem('auth') === 'true';

    if (!token || !isAuthenticated) {
        return <Navigate to="/" />;
    }

    try {
        const decoded = jwtDecode(token);
        return children;
    } catch (error) {
        localStorage.removeItem('token');
        sessionStorage.removeItem('auth')
        return <Navigate to="/" />;
    }
}

export default PrivateRoute;