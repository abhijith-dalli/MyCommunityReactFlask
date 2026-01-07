import { useEffect, useState } from "react";
import NavBar from "../Common/Navbar";

function DashboardTile({ label, value, icon }) {
  return (
    <div className="dash-tile">
      <div className="dash-tile-icon">
        <i className={`fa ${icon}`}></i>
      </div>
      <div>
        <div className="dash-tile-value">{value}</div>
        <div className="dash-tile-label">{label}</div>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    apartments: 0,
    reports: 0,
    logs: 0
  });

  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    // mock data – replace with APIs
    setStats({
      users: 48,
      apartments: 7,
      reports: 6,
      logs: 214
    });

    setUsers([
      { id: 1, name: "Abhijith", role: "Admin" },
      { id: 2, name: "Ravi", role: "Owner" },
      { id: 3, name: "Kiran", role: "Security" }
    ]);

    setReports([
      { id: 1, title: "Lift not working" },
      { id: 2, title: "Water leakage in Block B" }
    ]);
  }, []);

  return (
    <>
    <NavBar />
    <div className="dash-wrap">

      {/* HEADER */}
      <div className="dash-header">
        <h2>Admin Dashboard</h2>
        <p>Overview of system activity and management</p>
      </div>

      {/* STATS */}
      <div className="dash-grid">
        <DashboardTile label="Users" value={stats.users} icon="fa-users" />
        <DashboardTile label="Apartments" value={stats.apartments} icon="fa-building" />
        <DashboardTile label="Open Reports" value={stats.reports} icon="fa-flag" />
        <DashboardTile label="Audit Logs" value={stats.logs} icon="fa-file" />
      </div>

      {/* CONTENT */}
      <div className="dash-content">

        {/* USERS */}
        <div className="dash-panel">
          <h4>Recent Users</h4>
          <table className="dash-table">
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>
                    <span className={`dash-role ${u.role.toLowerCase()}`}>
                      {u.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* REPORTS */}
        <div className="dash-panel">
          <h4>Recent Reports</h4>
          {reports.map(r => (
            <div key={r.id} className="dash-report">
              <i className="fa fa-exclamation-circle"></i>
              {r.title}
            </div>
          ))}
        </div>

      </div>
    </div>
  </>);
}

export default AdminDashboard;
