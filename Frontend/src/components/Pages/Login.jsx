import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [ack, setAck] = useState("")
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    fetch("http://localhost:4000/User?username="+username+"&password="+password,{
      method: "GET"
    })
    .then(res => res.text())
    .then(data => {
      if(data != 'Failed'){
        setAck("")
        localStorage.setItem("username", username);
        localStorage.setItem("user_id", data);
        localStorage.setItem("token", "demo-token");
        navigate("/home", { replace: true });
      } 
      else{
        setAck('Invalid credentials')
      }
    })
    .catch(error => {
      console.error(error);
    })
  };
  return (
    <div className="container vh-100 d-flex align-items-center justify-content-center">
      <div className="card shadow-lg p-4" style={{width: "100%", maxWidth: "420px"}}>
          <h3 className="text-center mb-4">Login</h3>
          {ack ? (<div className="alert alert-danger text-center">{ack}</div>) : <div></div>}
          <form onSubmit={handleLogin} method="post">
              <div className="mb-3">
                  <label className="form-label">Username</label>
                  <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-person"></i></span>
                      <input type="text" name="username" value={username} onChange={(e)=>setUsername(e.target.value)} className="form-control" required />
                  </div>
              </div>

              <div className="mb-3">
                  <label className="form-label">Password</label>
                  <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-lock"></i></span>
                      <input type="password" name="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="form-control" required />
                  </div>
              </div>

              <button className="btn btn-primary w-100" type="submit">Login</button>
          </form>

          <div className="text-center mt-3">
              <small>
                  Don't have an account? 
                  <Link to="/register">Register</Link>
              </small>
          </div>
      </div>
    </div>
  );
}

export default Login;
