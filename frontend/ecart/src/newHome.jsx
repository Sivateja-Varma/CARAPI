import React from 'react';
import { NavLink } from 'react-router';

export default function HomePage() {
  return (
    <>
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
  <div className="container-fluid">
    <a className="navbar-brand" href="#">
      Navbar
    </a>
    <button
      className="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon" />
    </button>
    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav">
        <li className="nav-item">
          <NavLink className="btn" aria-current="page" to="/Login">
            Login
          </NavLink>
          <NavLink className="btn" aria-current="page" to="/create">
            Create
          </NavLink>
          <NavLink className="btn" aria-current="page" to="/login">
            Login
          </NavLink>
        </li>
        {/* <li className="nav-item">
          <a className="nav-link" href="#">
            Features
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">
            Pricing
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link disabled" aria-disabled="true">
            Disabled
          </a>
        </li> */}
      </ul>
    </div>
  </div>
</nav>

<div>
  <h1>CarAPI*</h1>
</div>
    </>
  );
}
