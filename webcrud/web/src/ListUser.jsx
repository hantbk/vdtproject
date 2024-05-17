import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function ListUser() {
    const { id } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:9000/getUser/${id}`)
            .then(res => {
                setUser(res.data);
            })
            .catch(err => console.error(err));
    }, [id]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-5">
            <h1 className="mb-4">User Information</h1>
            <div className="card">
                <div className="card-body">
                    <div className="mb-3">
                        <h5 className="card-title">Name: {user.name}</h5>
                    </div>
                    <div className="mb-3">
                        <p className="card-text">Gender: {user.gender}</p>
                    </div>
                    <div className="mb-3">
                        <p className="card-text">School: {user.school}</p>
                    </div>
                    <div className="mb-3">
                        <p className="card-text">Date of Birth: {user.dob ? user.dob : "N/A"}</p>
                    </div>
                    <div className="mb-3">
                        <p className="card-text">Email: {user.email ? user.email : "N/A"}</p>
                    </div>
                    <div className="mb-3">
                        <p className="card-text">Phone: {user.phone ? user.phone : "N/A"}</p>
                    </div>
                    <div className="mb-3">
                        <p className="card-text">Country: {user.country ? user.country : "N/A"}</p>
                    </div>
                    {/* Button to navigate back to home */}
                    <Link to="/" className="btn btn-primary">Go back to Home</Link>
                </div>
            </div>
        </div>
    );
}

export default ListUser;
