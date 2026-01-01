import { useState,useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
function NavBar(){
    const navigate = useNavigate();
    const logout = () => {
        localStorage.removeItem("token");
        navigate("/", { replace: true });
    };

    return(
        <nav className="navbar navbar-expand-lg navbar-dark navbar-custom py-3">
            <div className="container-fluid">
                <div className="d-flex align-items-center gap-3">
                    <img src="../media/logo.jpg" width="55" height="45" className="rounded shadow"/>
                    <span className="navbar-brand text-uppercase">My Community</span>
                    <span className="badge bg-light text-dark">Owner</span>
                </div>

                <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                <ul className="navbar-nav align-items-center gap-4">
                    <li className="nav-item"><a className="nav-link active" href="#"><i className="fa fa-house"></i> Home</a></li>
                    <li className="nav-item"><a className="nav-link" href="#"><i className="fa fa-user-plus"></i> Visitor</a></li>
                    <li className="nav-item"><a className="nav-link" href="#"><i className="fa fa-users"></i> Visitors</a></li>

                    <li className="nav-item dropdown hover-dropdown">
                    <a className="nav-link dropdown-toggle">
                        <i className="fa fa-bolt"></i> Actions
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end shadow">
                        <li><Link className="dropdown-item" to="/events"><i className="fa fa-calendar"></i> Upload Event</Link></li>
                        <li><Link className="dropdown-item" to=""><i className="fa fa-star"></i> Upload Review</Link></li>
                        <li><Link className="dropdown-item" to=""><i className="fa fa-user"></i> Edit Profile</Link></li>
                    </ul>
                    </li>

                    <li className="nav-item">
                    <button onClick={logout} className="btn btn-outline-light px-4">
                        <i className="fa fa-right-from-bracket"></i> Logout
                    </button>
                    </li>
                </ul>
                </div>
            </div>
        </nav>)
    }
export default NavBar;