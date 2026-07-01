import React, { useContext } from 'react';
import { GlobalItems } from './context';
import { NavLink, useNavigate } from 'react-router';

export default function ItemView() {
  const items = useContext(GlobalItems)
  const navigate = useNavigate()
  return (
    <>
      {items.map(item=>{
        return( 
        <>
        <div className="card" style={{ width: "18rem" }}>
        <img src={item.image_url} className="card-img-top" alt="..." />
         <div className="card-body">
        <h5 className="card-title">{item.brand}</h5>
        <p className="card-text">
            {item.name}
        </p>
        <NavLink to={`/update/${item.id}`} className="btn btn-primary m-3">
         Update
        </NavLink>
        <button className="btn btn-danger" onClick={ async ()=>{
      const response = await fetch(`/api/DeleteCar/${item.id}`,{
        method:"DELETE",
        headers:{
          'Authorization':"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZXhwIjoxNzc5NDY1MDM5fQ.8ieNjsOMkdI4UZq0X9eFOmi65Odx4w0tzwgOGT5pzhM"
        }
      })
      if (response.ok){
        setTimeout(()=>{
          navigate('/',{state:{updated:true}})
        },1500)
      }
    }}>
         Delete
        </button>
        </div>
        
      </div>

      
        </>)
      })}
    </>
  );
}
