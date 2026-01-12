import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import NavBar from "../Common/Navbar";

function ErrorAck(props){
  return (<small id={props.id} className="text-danger">{props.message}</small>);
}

function AdminManagement() {
  const [activeTab, setActiveTab] = useState("user");

  const [apartments, setApartments] = useState([]);

  const [user, setUser] = useState({
    username: "",
    email: "",
    phone: "",
    role: "Admin",
    apartment_id: "-1"
  });
  
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    phone: "",
    apartment_id: ""
  });

  const [apt, setapt] = useState({
    name: "",
    location: "",
    totalFlats: "",
    flats: []
  });
  const [duplicateFlatsMsg , setMsg] = useState("")
  function getApartmentListings(){
    fetch("http://localhost:4000/admin/apartments?obj=apt")
      .then(res => res.json())
      .then(data => setApartments(data))
      .catch(() => setApartments([]));
  }
  useEffect(() => getApartmentListings, []);

  function handleUserChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  function submitUser(e) {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var error_struct = {}
    var validate = true
    for(let i in user){
      if(i == 'email' && !emailRegex.test(user[i])){
        error_struct[i] = "Enter a valid email address";
        validate = false;
      }
      else if(i == 'apartment_id' && user[i] == -1){
        error_struct[i] = 'Please choose an option.'
        validate = false;
      }
      else if(user[i] == ''){
        error_struct[i] = 'This field is required.'
        validate = false;
      }
    }
    setErrors(values => (error_struct))
    if(validate === true) {
      const json_data = new FormData(e.target)
      fetch("http://localhost:4000/User",{
        method: "POST",
        body: json_data
      })
      .then(res => res.text())
      .then(data => {
        setUser({
          username: "",
          email: "",
          phone: "",
          role: "Admin",
          apartment_id: "-1"
        })
      })
    }
  }

  function handleApartmentChange(e) {
    const { name, value } = e.target;

    if (name === "totalFlats") {
      const count = Number(value) || 0;

      setapt(prev => ({
        ...prev,
        totalFlats: value,
        flats: Array.from({ length: count }, (_, i) => prev.flats[i] || "")
      }));
    } else {
      setapt({ ...apt, [name]: value });
    }
  }

  function handleFlatChange(index, value) {
    const updated = [...apt.flats];
    updated[index] = value;
    setapt({ ...apt, flats: updated });
  }

  function submitApartment(e) {
    e.preventDefault();
    const allFlats = apt.flats;
    let duplicateFlats = allFlats.filter((value, index) => 
    allFlats.indexOf(value) !== index && allFlats.lastIndexOf(value) === index);
    if(duplicateFlats.length == 0){
      const json_data = new FormData(e.target)
      fetch("http://localhost:4000/admin/apartments",{
        method: "POST",
        body: json_data
      })
      .then(res => res.text())
      .then(data => {
        console.log(data);
        setapt({
          name: "",
          location: "",
          totalFlats: "",
          flats: []
        })
        getApartmentListings()
      })
    }
    else{
      setMsg('Flat No: '+duplicateFlats+' cannot be duplicate');
    }
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
                    />
                    {errors.username && <ErrorAck id="usernameError" message={errors.username}/>}
                    </div>

                    <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input
                        type="text"
                        className="form-control admin-input"
                        name="email"
                        value={user.email}
                        onChange={handleUserChange}
                    />
                    {errors.email && <ErrorAck id="emailError" message={errors.email}/>}
                    </div>

                    <div className="col-md-6">
                    <label className="form-label">Phone</label>
                    <input
                        className="form-control admin-input"
                        name="phone"
                        value={user.phone}
                        onChange={handleUserChange}
                    />
                    {errors.phone && <ErrorAck id="phoneError" message={errors.phone}/>}
                    </div>

                    <div className="col-md-6">
                    <label className="form-label">Role</label>
                    <input
                        className="form-control admin-input"
                        name="role"
                        value={user.role}
                        readOnly
                    />
                    </div>

                    <div className="col-md-12">
                    <label className="form-label">Apartment</label>
                    <select
                        className="form-select admin-select"
                        name="apartment_id"
                        value={user.apartment_id}
                        onChange={handleUserChange}
                    >
                        <option value="-1">Select Apartment</option>
                        {apartments.map(a => (
                        <option key={a.id} value={a.id}>
                            {a.name} {"("+a.loc+")"}
                        </option>
                        ))}
                    </select>
                    {errors.apartment_id && <ErrorAck id="apartment_idError" message={errors.apartment_id}/>}
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
                        value={apt.name}
                        onChange={handleApartmentChange}
                        required
                    />
                    </div>

                    <div className="mb-3">
                    <label className="form-label">Location</label>
                    <input
                        className="form-control admin-input"
                        name="location"
                        value={apt.location}
                        onChange={handleApartmentChange}
                        required
                    />
                    </div>

                    <div className="mb-3">
                    <label className="form-label">Total Flats</label>
                    <input
                        type="number"
                        className="form-control admin-input"
                        name="totalFlats"
                        value={apt.totalFlats}
                        onChange={handleApartmentChange}
                        required
                    />
                    </div>

                    {apt.flats.length > 0 && (
                    <div className="fade-slide">
                        <label className="form-label fw-semibold">Flat Numbers</label>

                        <div className="row g-2">
                        {apt.flats.map((flat, i) => (
                            <div className="col-md-3" key={i}>
                            <input
                                className="form-control admin-input"
                                placeholder={`Flat ${i + 1}`}
                                value={flat}
                                onChange={e => handleFlatChange(i, e.target.value)}
                                required
                            />
                            </div>
                        ))}
                        <input type="hidden" name='flats' id='flats' value={apt.flats}/>
                        </div>
                        {duplicateFlatsMsg && duplicateFlatsMsg != '' && <ErrorAck id="duplicateFlatsMsgError" message={duplicateFlatsMsg}/>}
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
