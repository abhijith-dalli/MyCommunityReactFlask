import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import NavBar from "../Common/Navbar";


function AdminManagement() {
  const [activeTab, setActiveTab] = useState("user");

  const [apartments, setApartments] = useState([]);

  const [user, setUser] = useState({
    username: "",
    email: "",
    phone: "",
    role: "Security",
    apartment_id: ""
  });

  const [apartment, setApartment] = useState({
    name: "",
    location: "",
    totalFlats: "",
    flats: []
  });

  useEffect(() => {
    fetch("http://localhost:4000/admin/apartments")
      .then(res => res.json())
      .then(data => setApartments(data))
      .catch(() => setApartments([]));
  }, []);

  function handleUserChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  function submitUser(e) {
    e.preventDefault();
    console.log("USER:", user);
  }

  function handleApartmentChange(e) {
    const { name, value } = e.target;

    if (name === "totalFlats") {
      const count = Number(value) || 0;

      setApartment(prev => ({
        ...prev,
        totalFlats: value,
        flats: Array.from({ length: count }, (_, i) => prev.flats[i] || "")
      }));
    } else {
      setApartment({ ...apartment, [name]: value });
    }
  }

  function handleFlatChange(index, value) {
    const updated = [...apartment.flats];
    updated[index] = value;
    setApartment({ ...apartment, flats: updated });
  }

  function submitApartment(e) {
    e.preventDefault();
    console.log("APARTMENT:", apartment);
  }

  return (
    <>
        <NavBar />
        <div className="container mt-4 admin-page">
            <ul className="nav nav-tabs admin-tabs mb-4">
            <li className="nav-item">
                <button
                className={`nav-link ${activeTab === "user" ? "active" : ""}`}
                onClick={() => setActiveTab("user")}
                >
                <i className="fa fa-user-plus me-1"></i> Create User
                </button>
            </li>

            <li className="nav-item">
                <button
                className={`nav-link ${activeTab === "apartment" ? "active" : ""}`}
                onClick={() => setActiveTab("apartment")}
                >
                <i className="fa fa-building me-1"></i> Create Apartment
                </button>
            </li>
            </ul>

            {activeTab === "user" && (
            <div className="card admin-card shadow-sm">
                <div className="card-header admin-header">
                Create New User
                </div>

                <div className="card-body">
                <form className="row g-3" onSubmit={submitUser}>

                    <div className="col-md-6">
                    <label className="form-label">Username</label>
                    <input
                        className="form-control admin-input"
                        name="username"
                        value={user.username}
                        onChange={handleUserChange}
                        required
                    />
                    </div>

                    <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control admin-input"
                        name="email"
                        value={user.email}
                        onChange={handleUserChange}
                    />
                    </div>

                    <div className="col-md-6">
                    <label className="form-label">Phone</label>
                    <input
                        className="form-control admin-input"
                        name="phone"
                        value={user.phone}
                        onChange={handleUserChange}
                    />
                    </div>

                    <div className="col-md-6">
                    <label className="form-label">Role</label>
                    <input
                        className="form-control admin-input"
                        name="role"
                        value={user.role}
                        disabled
                    />
                    </div>

                    <div className="col-md-12">
                    <label className="form-label">Apartment</label>
                    <select
                        className="form-select admin-select"
                        name="apartment_id"
                        value={user.apartment_id}
                        onChange={handleUserChange}
                        required
                    >
                        <option value="">Select Apartment</option>
                        {apartments.map(a => (
                        <option key={a.id} value={a.id}>
                            {a.name} {"("+a.loc+")"}
                        </option>
                        ))}
                    </select>
                    </div>

                    <div className="col-12 text-end">
                    <button className="admin-btn">
                        <i className="fa fa-save me-2"></i>Create User
                    </button>
                    </div>

                </form>
                </div>
            </div>
            )}

            {activeTab === "apartment" && (
            <div className="card admin-card shadow-sm">
                <div className="card-header admin-header">
                Create Apartment
                </div>

                <div className="card-body">
                <form onSubmit={submitApartment}>

                    <div className="mb-3">
                    <label className="form-label">Apartment Name</label>
                    <input
                        className="form-control admin-input"
                        name="name"
                        value={apartment.name}
                        onChange={handleApartmentChange}
                        required
                    />
                    </div>

                    <div className="mb-3">
                    <label className="form-label">Location</label>
                    <input
                        className="form-control admin-input"
                        name="location"
                        value={apartment.location}
                        onChange={handleApartmentChange}
                    />
                    </div>

                    <div className="mb-3">
                    <label className="form-label">Total Flats</label>
                    <input
                        type="number"
                        className="form-control admin-input"
                        name="totalFlats"
                        value={apartment.totalFlats}
                        onChange={handleApartmentChange}
                    />
                    </div>

                    {apartment.flats.length > 0 && (
                    <div className="fade-slide">
                        <label className="form-label fw-semibold">Flat Numbers</label>

                        <div className="row g-2">
                        {apartment.flats.map((flat, i) => (
                            <div className="col-md-3" key={i}>
                            <input
                                className="form-control admin-input"
                                placeholder={`Flat ${i + 1}`}
                                value={flat}
                                onChange={e => handleFlatChange(i, e.target.value)}
                            />
                            </div>
                        ))}
                        </div>
                    </div>
                    )}

                    <div className="text-end mt-4">
                        <button className="admin-btn">
                            <i className="fa fa-plus me-2"></i>Add Apartment
                        </button>
                    </div>

                </form>
                </div>
            </div>
            )}

        </div>
    </>
  );
}

export default AdminManagement;
