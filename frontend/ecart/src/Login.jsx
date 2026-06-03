import React, { useContext, useRef } from 'react';
import { Security } from './context';
import { NavLink, useNavigate } from 'react-router';

export default function LoginUser() {
  const {setToken}=useContext(Security)
  const nameRef = useRef(null)
  const passRef = useRef(null)
  const navigate = useNavigate()
  
  
  async function SubmitUser(event){
    event.preventDefault()
  const  user = {'name':nameRef.current.value,'password':passRef.current.value}
  const response = await fetch('/api/login',{
    method:"POST",
    headers:{
    "Content-Type": "application/json",
  },
  body:JSON.stringify(user)

  })
  if (response.ok){
    const data = await response.json()
    localStorage.setItem("token",data.access_token)
    setToken(data.access_token)
    setTimeout(()=>{navigate("/")},1500)
  }
  
  }
  return (
    <>
    <form>
  <div className="mb-3">
    <label htmlFor="exampleInputEmail1" className="form-label">
      User Name
    </label>
    <input
      type="text"
      className="form-control"
      id="exampleInputEmail1"
      aria-describedby="emailHelp"
      ref={nameRef}
    />
  </div>
  <div className="mb-3">
    <label htmlFor="exampleInputPassword1" className="form-label">
      Password
    </label>
    <input
      type="password"
      className="form-control"
      id="exampleInputPassword1"
      ref={passRef}
    />
  </div>
  <button type="submit" className="btn btn-primary" onClick={SubmitUser}>
    Submit
  </button>
</form>
<NavLink to="/register" className="btn btn-warning mt-2">
  Sign Up
</NavLink>

    </>
  );
}
