import React, { useContext } from "react";
import { NavLink } from "react-router";
import { Security } from "./context";

export default function HomePage() {
  const {token,setToken}=useContext(Security)
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

            <a href="http://32.236.44.143:8000/redoc" className="btn btn-outline-light px-4">API Docs</a>

            {token?<button className="btn btn-danger"
            onClick={()=>{setToken("")
              localStorage.removeItem("token")
            }}>Logout</button>
            :<NavLink to="/login" className="btn btn-warning px-4 fw-semibold">
              Login
            </NavLink>}
            
          </div>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-overlay">
          <h1>Drive Your Dream</h1>
          <p>Luxury. Performance. Precision.</p>
        </div>
      </section>
    </>
  );
}
