import { useEffect, useState } from "react";
import NavBar from "../Common/Navbar";

const USERS_PER_PAGE = 5;
const APARTMENTS_PER_PAGE = 5;

function ErrorAck(props){
  return (<small id={props.id} className="text-danger">{props.message}</small>);
}

function AdminManageData() {
  const [activeTab, setActiveTab] = useState("users");

  const [users, setUsers] = useState([]);
  const [apartments, setApartments] = useState([]);

  const [editUser, setEditUser] = useState(null);
  const [editApartment, setEditApartment] = useState(null);
  const [dupMsg , setMsg] = useState("")

  /* -------- USERS FILTER STATE -------- */
  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [userPage, setUserPage] = useState(1);

  /* -------- APARTMENT FILTER STATE -------- */
  const [aptSearch, setAptSearch] = useState("");
  const [aptPage, setAptPage] = useState(1);

  function getUsersList(){
    fetch("http://localhost:4000/User")
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(() => setUsers([]));
  }
  function getApartmentListings(){
    fetch("http://localhost:4000/admin/apartments?obj=apt")
      .then(res => res.json())
      .then(data => setApartments(data))
      .catch(() => setApartments([]));
  }

  function handleEditUserSubmit(e){
    e.preventDefault();
    const json_data = new FormData(e.target)
    fetch("http://localhost:4000/User",{
          method: "PATCH",
          body: json_data,
      })
      .then(res=> res.text())
      .then(data=>{
        if(data == 'Updated'){
          document.getElementById('editUsermodal').click();
          getUsersList();
        }
      })
      .catch(error => {
        alert("Something went wrong! ",data)
      })
  }

  function handleAptEditSubmit(e){
    e.preventDefault();
    const json_data = new FormData(e.target)
    fetch("http://localhost:4000//admin/apartments",{
        method: "PATCH",
        body: json_data,
    })
    .then(res=> res.text())
    .then(data=>{
      if(data == 'Updated'){
        document.getElementById('editAptmodal').click();
        getApartmentListings();
      }
    })
    .catch(error => {
      alert("Something went wrong! ",data)
    })
  }
  useEffect(() => {
    getUsersList();
    getApartmentListings();
  }, []);

  const filteredUsers = users.filter(u => {
    const searchMatch =
      u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());

    const roleMatch = roleFilter === "" || u.role === roleFilter;

    return searchMatch && roleMatch;
  });

  const userTotalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

  const paginatedUsers = filteredUsers.slice(
    (userPage - 1) * USERS_PER_PAGE,
    userPage * USERS_PER_PAGE
  );

  const filteredApartments = apartments.filter(a =>
    a.name.toLowerCase().includes(aptSearch.toLowerCase())
  );

  const aptTotalPages = Math.ceil(filteredApartments.length / APARTMENTS_PER_PAGE);

  const paginatedApartments = filteredApartments.slice(
    (aptPage - 1) * APARTMENTS_PER_PAGE,
    aptPage * APARTMENTS_PER_PAGE
  );

  return (
    <>
    <NavBar />
    <div className="container mt-4 admin-page">

      <ul className="nav nav-tabs admin-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            <i className="fa fa-users me-1"></i> Users
          </button>
        </li>

        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "apartments" ? "active" : ""}`}
            onClick={() => setActiveTab("apartments")}
          >
            <i className="fa fa-building me-1"></i> Apartments
          </button>
        </li>
      </ul>

      {activeTab === "users" && (
        <div className="card admin-card shadow-sm">
          <div className="card-header admin-header">Manage Users</div>

          {/* FILTERS */}
          <div className="card-body border-bottom d-flex gap-2">
            <input
              className="form-control admin-input"
              placeholder="Search username or email..."
              value={userSearch}
              onChange={e => {
                setUserSearch(e.target.value);
                setUserPage(1);
              }}
            />

            <select
              className="form-select admin-select"
              value={roleFilter}
              onChange={e => {
                setRoleFilter(e.target.value);
                setUserPage(1);
              }}
              style={{ maxWidth: "180px" }}
            >
              <option value="">All Roles</option>
              <option value="Owner">Owner</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div className="card-body p-0">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Apartment</th>
                  <th>Flat</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>

              <tbody>
                {paginatedUsers.map(u => (
                  <tr key={u.id} className={u.status}>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`role-badge ${u.role}`}>{u.role}</span>
                    </td>
                    <td>{u.apartment}</td>
                    <td>{u.flat}</td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm admin-btn"
                        data-bs-toggle="modal"
                        data-bs-target="#editUserModal"
                        onClick={() => setEditUser({ ...u })}
                      >
                        <i className="fa fa-edit"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card-body d-flex justify-content-between">
            <span className="text-muted">
              Page {userPage} of {userTotalPages || 1}
            </span>

            <div className="btn-group">
              <button
                className="btn btn-light btn-sm"
                disabled={userPage === 1}
                onClick={() => setUserPage(p => p - 1)}
              >
                Prev
              </button>
              <button
                className="btn btn-light btn-sm"
                disabled={userPage === userTotalPages}
                onClick={() => setUserPage(p => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "apartments" && (
        <div className="card admin-card shadow-sm">
          <div className="card-header admin-header">Manage Apartments</div>

          {/* FILTER */}
          <div className="card-body border-bottom">
            <input
              className="form-control admin-input"
              placeholder="Search apartment name..."
              value={aptSearch}
              onChange={e => {
                setAptSearch(e.target.value);
                setAptPage(1);
              }}
            />
          </div>

          <div className="card-body p-0">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Apartment</th>
                  <th>Total Flats</th>
                  <th>Location</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>

              <tbody>
                {paginatedApartments.map(a => (
                  <tr key={a.id} className={a.status}>
                    <td>{a.name}</td>
                    <td>{a.flats.length}</td>
                    <td>{a.loc}</td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm admin-btn"
                        data-bs-toggle="modal"
                        data-bs-target="#editApartmentModal"
                        onClick={() =>
                          setEditApartment({
                            ...a,
                            flats: [...a.flats]
                          })
                        }
                      >
                        <i className="fa fa-edit"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card-body d-flex justify-content-between">
            <span className="text-muted">
              Page {aptPage} of {aptTotalPages || 1}
            </span>

            <div className="btn-group">
              <button
                className="btn btn-light btn-sm"
                disabled={aptPage === 1}
                onClick={() => setAptPage(p => p - 1)}
              >
                Prev
              </button>
              <button
                className="btn btn-light btn-sm"
                disabled={aptPage === aptTotalPages}
                onClick={() => setAptPage(p => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="modal fade" id="editUserModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5>Edit User</h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form onSubmit={handleEditUserSubmit}>
            {editUser && (
              <div className="modal-body">
                <input type="hidden" name="user_id" value={editUser.id} />
                <input
                  name = "username"
                  className="form-control admin-input mb-2"
                  value={editUser.username}
                  onChange={e =>
                    setEditUser({ ...editUser, username: e.target.value })
                  }
                  required
                />

                <input
                  name = "email"
                  className="form-control admin-input mb-2"
                  value={editUser.email}
                  onChange={e =>
                    setEditUser({ ...editUser, email: e.target.value })
                  }
                  required
                />

                <input
                  name = "phone"
                  className="form-control admin-input mb-2"
                  value={editUser.phone}
                  onChange={e =>
                    setEditUser({ ...editUser, phone: e.target.value })
                  }
                  required
                />

                <select
                  name = "status"
                  className="form-select admin-select"
                  value={editUser.status}
                  onChange={e =>
                    setEditUser({ ...editUser, status: e.target.value })
                  }
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            )}

            <div className="modal-footer">
              <button className="btn btn-light" data-bs-dismiss="modal">
                Cancel
              </button>
              <input type="hidden" id='editUsermodal' data-bs-dismiss="modal"/>
              <button
                className="admin-btn"
                type="submit"
              >
                Save
              </button>
            </div>
            </form>
          </div>
        </div>
      </div>

      <div className="modal fade" id="editApartmentModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5>Edit Apartment</h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form onSubmit={handleAptEditSubmit}>
            {editApartment && (
              <div className="modal-body">
                <input type="hidden" name="apt_id" value={editApartment.id} />
                <input
                  className="form-control admin-input mb-3"
                  name='aname'
                  value={editApartment.name}
                  onChange={e =>
                    setEditApartment({
                      ...editApartment,
                      name: e.target.value
                    })
                  }
                  required
                />
                <input
                  className="form-control admin-input mb-3"
                  name='loc'
                  value={editApartment.loc}
                  onChange={e =>
                    setEditApartment({
                      ...editApartment,
                      loc: e.target.value
                    })
                  }
                  required
                />
                <select
                  name = "status"
                  className="form-select admin-select mb-3"
                  value={editApartment.status}
                  onChange={e =>
                    setEditApartment({ ...editApartment, status: e.target.value })
                  }
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <div className="row g-2">
                  {editApartment.flats.map((f) => (
                    <div className="col-md-3" key={f.id}>
                      <input
                        className="form-control admin-input"
                        id={'flat_'+f.id}
                        value={f.name}
                        readOnly
                        // onChange={e => {
                        //   const updated = [...editApartment.flats];
                        //   updated[i] = e.target.value;
                        //   setEditApartment({
                        //     ...editApartment,
                        //     flats: updated
                        //   });
                        // }}
                        // required
                      />
                    </div>
                  ))}
                  {/* <input type="hidden" name="flats" value={JSON.stringify(editApartment.flats, null, 2)}/> */}
                  { dupMsg != '' && <ErrorAck id="duplicateFlatsError" message={'Flat No: '+dupMsg+' cannot be duplicate.'}/> }
                </div>
              </div>
            )}

            <div className="modal-footer">
              <button className="btn btn-light" data-bs-dismiss="modal">
                Cancel
              </button>
              <input type="hidden" id='editAptmodal' data-bs-dismiss="modal"/>
              <button
                className="admin-btn"
                type="submit"
              >
                Save
              </button>
            </div>
            </form>
          </div>
        </div>
      </div>

    </div>
    </>
  );
}

export default AdminManageData;
