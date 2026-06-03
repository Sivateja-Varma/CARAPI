import React, { useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router';


export default function RegisterUser() {
  const nameRef = useRef(null)
  const passRef = useRef(null)
  const navigate = useNavigate()
  async function registerUsernow(event){
    
    event.preventDefault();
    const User = {name:nameRef.current.value,password:passRef.current.value}
    const response = await fetch("/api/register",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      body:JSON.stringify(User)
    })
    if (response.ok){
      navigate("/login")
    }else {
      console.log("iamhere")
      toast.error("retry please")
    }
  }
  return (
    <>
    <Toaster position='top-right'></Toaster>
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
  <button type="submit" className="btn btn-primary"
  onClick={registerUsernow}>
    Submit
  </button>
  
</form>

    </>
  );
}
