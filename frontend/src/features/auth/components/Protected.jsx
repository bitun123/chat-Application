import React, { useEffect } from 'react'
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';

function Protected({ children }) {
    const { user, loading } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    
    // ✅ Use useEffect to navigate instead of calling in render
    useEffect(() => {
        if (!loading && !user) {
            navigate("/login");
        }
    }, [user, loading, navigate]);
    
    if (loading) {
        return <div>Loading...</div>
    }

    if (!user) {
        return null;
    }

    return (
        <div>
            {children}
        </div>
    )
}

export default Protected
