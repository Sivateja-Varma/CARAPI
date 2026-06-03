import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';

export default function CreateForm() {
  const [car,setCar]=useState({brand:"",name:""})
  const [filecont,setFilecont]=useState(null)
  const navigate = useNavigate()
  return (
    <>
     <nav className="navbar navbar-expand-lg navbar-dark custom-navbar">
        <div className="container-fluid px-5">
          <NavLink className="navbar-brand fw-bold fs-2" to="/">
            CarHub
          </NavLink>

          <div className="d-flex gap-3">
            <NavLink to="/create" className="btn btn-outline-light px-4">
              Add Car
            </NavLink>

            <NavLink to="/login" className="btn btn-warning px-4 fw-semibold">
              Login
            </NavLink>
          </div>
        </div>
      </nav>

  <form>
  <div className="mb-3">
    <label htmlFor="brand" className="form-label">
      Car Brand
    </label>
    <input
      type="text"
      className="form-control"
      id="brand"
      aria-describedby="brand field"
      value={car.brand}
      onChange={(event)=>{setCar(prev=>({...prev,brand:event.target.value}))}}
    />
  </div>
  <div className="mb-3">
    <label htmlFor="name" className="form-label">
      Car Name
    </label>
    <input
      type="text"
      className="form-control"
      id="name"
      value={car.name}
      onChange={(event)=>{setCar(prev=>({...prev,name:event.target.value}))}}
    />
  </div>
  <div className="mb-3">
  <label htmlFor='file'>Upload file</label>
  <input type="file"  className="form-control" id="file" 
  onChange={(event)=>{setFilecont(event.target.files[0])}}/>
  </div>
  <button type="submit" className="btn btn-primary"
  onClick={async (event)=>{
    event.preventDefault();
    const formData = new FormData()
    formData.append('brand', car.brand);
    formData.append('name', car.name);
    if (filecont) {
      formData.append('image', filecont);
    }
    try{
      const response=await fetch("/api/createCar",{
        method:"POST",

        body:formData
      });
      if (response.ok){
      navigate("/",{state:{updated:true}})

    }
  }
    catch(error){
      console.log(error)
    }
  
  }
  }>
    Submit
  </button>

</form>

    </>
  );
}
