import React, { useContext } from "react";
import { GlobalItems, Security } from "./context";
import { NavLink, useLocation, useNavigate } from "react-router";

export default function ItemView() {
  const {items,setItems} = useContext(GlobalItems);
  const navigate = useNavigate();
  const {token} = useContext(Security)
  const location = useLocation()
  const savedToken= localStorage.getItem("token")

  async function deleteCar(idToDelete) {
    console.log(token)
    const response = await fetch(`/api/DeleteCar/${idToDelete}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${savedToken}`,
      },
    });
    console.log(response.headers)

    if (response.ok) {
       setItems((prevItems) => prevItems.filter((item) => item.id !== idToDelete));
      
    }
  }

  return (
    <div className="row g-5">
      {items.map((item) => (
        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3" key={item.id}>
          <div className="car-card">
            <div className="image-wrapper">
              <img src={item.image_url} alt={item.name} />
            </div>

            <div className="car-content">
              <h3>{item.brand}</h3>
              <p>{item.name}</p>

              <div className="btn-group-custom">
                <NavLink
                  to={`/update/${item.id}`}
                  className="btn btn-primary"
                >
                  Update
                </NavLink>

                <button
                  className="btn btn-danger"
                  onClick={() => deleteCar(item.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}