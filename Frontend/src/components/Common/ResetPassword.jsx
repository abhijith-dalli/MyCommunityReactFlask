import { useState,useEffect } from "react";
import { useNavigate,useSearchParams,Link } from "react-router-dom";

function Reset() {
    const [userId, setUserId]= useState(-1);
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [ack, setAck] = useState("")
    const [searchParams] = useSearchParams();
    const [verified,setVerified] = useState('False');
    const navigate = useNavigate();

    function verifyUser(e){
        e.preventDefault()
        setAck("")
        if(username && phone){
            fetch("http://localhost:4000/User?username="+username+"&phone="+phone,{
            method: "GET"
            })
            .then(res => res.json())
            .then(data => {
                if(data.length){
                    setUserId(data[0].id)
                    setVerified('True')
                }
                else{
                    setAck("This username is not associated with the provided phone number.")
                }
            })
            .catch(error => {
            console.error(error);
            })
        }
    }

    function handleSubmit(e){
        e.preventDefault()
        setAck("")
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).+$/;
        const form_data = new FormData(e.target);
        if(passwordRegex.test(password) && password == confirm){
            fetch("http://localhost:4000/User",{
            method: "PATCH",
            body : form_data
            })
            .then(res => res.text())
            .then(data => {
                if(data == 'Updated'){
                    navigate("/", { replace: true });
                }
            })
            .catch(error => {
            console.error(error);
            })
        }
        else{
            if(!passwordRegex.test(password)){
                setAck("The password should have atleast one Capital letter and a number.")
            }
            else{
                setAck("Both passwords should match.")
            }
        }
    }

  return (
    <div className="container vh-100 d-flex align-items-center justify-content-center">
      <div className="card shadow-lg p-4" style={{width: "100%", maxWidth: "420px"}}>
          <h3 className="text-center mb-4">Reset password</h3>
          {ack ? (<div className="alert alert-danger text-center">{ack}</div>) : <div></div>}
          {verified == 'False' && <form onSubmit={verifyUser} method="post">
              
              <div className="mb-3">
                  <label className="form-label">Username</label>
                  <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-person"></i></span>
                      <input type="text" name="username" value={username} onChange={(e)=>setUsername(e.target.value)} className="form-control" required/>
                  </div>
              </div>

              <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-phone"></i></span>
                      <input type="hidden" name='reset' value="true" />
                      <input type="text" name="phone" value={phone} onChange={(e)=>setPhone(e.target.value)} className="form-control" required/>
                  </div>
              </div>

              <button className="btn btn-primary w-100" type="submit">Submit</button>
          </form>}
          {verified == 'True' && <form onSubmit={handleSubmit} method="post">
              
              <div className="mb-3">
                  <label className="form-label">Username</label>
                  <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-person"></i></span>
                      <input type="hidden" name='user_id' value={userId} />
                      <input type="text" name="username" value={username} onChange={(e)=>setUsername(e.target.value)}  className="form-control" readOnly/>
                  </div>
              </div>

              <div className="mb-3">
                  <label className="form-label">Password</label>
                  <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-key"></i></span>
                      <input type="password" name="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="form-control" />
                  </div>
              </div>

              <div className="mb-3">
                  <label className="form-label">Confirm Password</label>
                  <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-key"></i></span>
                      <input type="password" value={confirm} onChange={(e)=>setConfirm(e.target.value)} className="form-control" />
                  </div>
              </div>

              <button className="btn btn-primary w-100" type="submit">Submit</button>
          </form>}
            <div className="text-end mb-3">
                <small>
                    <Link to="/">Go back to login page?</Link>
                </small>
            </div>
      </div>            
    </div>
  );
}

export default Reset;
