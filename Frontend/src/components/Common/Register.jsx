import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../../styles/styles.css';

function ErrorAck(props){
  return (<small id={props.id} className="text-danger">{props.message}</small>);
}

function Register() {
  const [register, setRegister] = useState({
    flat : -1,
    username : '',
    apartment : -1,
    phone : '',
    email : '',
    password : '',
    confirmpassword: ''
  });
  const [aptOpt, setAptOpt] = useState([])
  const [flatOpt, setFlatOpt] = useState([])
  const [errors, setErrors] = useState({
    flat : '',
    username : '',
    apartment : '',
    phone : '',
    email : '',
    password : '',
    confirmpassword: ''
  });

  // To get the apartment listings
  useEffect(() => {
    fetch("http://localhost:4000/admin/apartments?obj=apt")
      .then(res => res.json())
      .then(data => setAptOpt(data))
      .catch(() => setAptOpt([]));
  }, []);

  function handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    setRegister(values => ({...values, [name]: value}))
    if(name === 'apartment'){
      fetch("http://localhost:4000/admin/apartments?apt_id="+value+'&obj=flat')
        .then(res => res.json())
        .then(data => {
          setFlatOpt(data)
          setRegister(value => ({
            ...value,
            flat: -1
          }));
        })
        .catch(() => {
          setFlatOpt([])
          setRegister(value => ({
            ...value,
            flat: -1
          }));
        });
    }
  }
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).+$/;
    var error_struct = {}
    var validate = true
    for(let i in register){
      if(i == 'apartment' && register[i] == -1){
        error_struct[i] = 'You must select an option.'
        validate = false;
      }
      else if(i == 'flat' && register[i] == -1){
        error_struct[i] = 'You must select an option based on the apartment.'
        validate = false;
      }
      else{
        if(i == 'email' && !emailRegex.test(register[i])){
          error_struct[i] = "Enter a valid email address";
          validate = false;
        }
        // else if(i == 'password' && !passwordRegex.test(register[i])){
        //   // Regex for future implementation 
        //   error_struct[i] = "Password must contain Min 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character";
        //   validate = false;
        // }
        else if(i == 'confirmpassword' && register[i] != register['password']){
          error_struct[i] = 'Passwords should match.'
          validate = false;
        }
        else if(register[i] == ''){
          error_struct[i] = 'This field is required.'
          validate = false;
        }
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
        alert(data);
        navigate("/", { replace: true });
      })
    }
  };

  return (
    <div className="register-page">
    <div className="register-wrapper">
      <div className="row g-0">
        <div className="col-md-5 register-left">
          <img src="https://cdn-icons-png.flaticon.com/512/942/942748.png" alt="Community"/>
          <h2>Join Your Community</h2>
          <p>
            Register your flat and stay connected with events, visitors,
            reviews, and important updates.
          </p>
        </div>

        <div className="col-md-7 register-right">
          <h3 className="register-title">Registration Form</h3>
          <form onSubmit={handleRegister} method="post">
            <input  type='hidden' id ='role' name="role" value='Owner'/>
            <div className="mb-3">
              <div className="input-group">
                <span className="input-group-text"><i className="fa fa-building"></i></span>
                <select className="form-select" id="apartment" name='apartment' value={register.apartment} onChange={handleChange} >
                  <option value="-1">Choose your apartment</option>
                  {aptOpt.map(a => (
                    <option key={a.id} value={a.id}>
                        {a.name} {"("+a.loc+")"}
                    </option>
                  ))}
                </select>
              </div>
              {errors.apartment && <ErrorAck id="apartmenterror" message={errors.apartment}/>}
            </div>
            <div className="mb-3">
              <div className="input-group">
                <span className="input-group-text"><i className="fa fa-door-closed"></i></span>
                {/* <input type="text" id="flat" name='flat' value={register.flat} onChange={handleChange} className="form-control" placeholder="Flat No"/> */}
                <select className="form-select" id="flat" name='flat' value={register.flat} onChange={handleChange} >
                  <option value="-1">Choose your flat</option>
                  {flatOpt.map(flat => (
                    <option key={flat.id} value={flat.id}>
                        {flat.name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.flat && <ErrorAck id="flaterror" message={errors.flat}/>}
            </div>
            <div className="mb-3">
              <div className="input-group">
                <span className="input-group-text"><i className="fa fa-user"></i></span>
                <input type="text" name='username' value={register.username} onChange={handleChange}  id="username" className="form-control" placeholder="Username"/>
              </div>
              {errors.username && <ErrorAck id="usernameerror" message={errors.username}/>}
            </div>

            <div className="mb-3">
              <div className="input-group">
                <span className="input-group-text"><i className="fa fa-phone"></i></span>
                <input type="text" id="phone" name='phone' value={register.phone} onChange={handleChange} className="form-control" placeholder="Phone Number"/>
              </div>
              {errors.phone && <ErrorAck id="phoneerror" message={errors.phone}/>}
            </div>

            <div className="mb-3">
              <div className="input-group">
                <span className="input-group-text"><i className="fa fa-envelope"></i></span>
                <input type="email" name='email' value={register.email} onChange={handleChange} id="email" className="form-control" placeholder="Email"/>
              </div>
              {errors.email && <ErrorAck id="emailerror" message={errors.email}/>}
            </div>

            <div className="mb-3">
              <div className="input-group">
                <span className="input-group-text"><i className="fa fa-lock"></i></span>
                <input type="password" name="password" id="password" value={register.password} onChange={handleChange} className="form-control" placeholder="Password"/>
              </div>
              {errors.password && <ErrorAck id="passworderror" message={errors.password}/>}
            </div>

            <div className="mb-4"> 
              <div className="input-group">
                <span className="input-group-text"><i className="fa fa-lock"></i></span>
                <input type="password" id="confirmpassword" name="confirmpassword" value={register.confirmpassword} onChange={handleChange}  className="form-control" placeholder="Confirm Password"/>
              </div>
              {errors.confirmpassword && register.password != register.confirmpassword && <ErrorAck id="confirmpassworderror" message="Passwords should match."/>}
            </div>

            <button type="submit" id="submitbtn" className="btn btn-register w-100">
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Register;
