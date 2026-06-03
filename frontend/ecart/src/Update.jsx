import React, { useEffect, useState } from 'react';
import { Form, useNavigate, useParams } from 'react-router';
import toast, {Toaster} from 'react-hot-toast'

export default function UpdateForm() {
  let param = useParams()
  const [car,setCar]=useState({brand:"",name:""})
  const navigate = useNavigate()
  // const [data,setData] = useState(null) 
  // console.log(data)

  async function finup(event){
      event.preventDefault();
      // setData(prev=>({...prev,car}))
      console.log(car)
      try{
        const response = await fetch(`/api/updateCar/${param.id}`,{
          method:"PUT",
          headers : {
            "Content-Type":"application/json",
          },
          body:JSON.stringify(car)
        })

        if (response.ok){
          toast.success("updated")
          setTimeout(()=>{navigate("/",{state:{updated:true}})},1500)
        }
        else{
          const errorData= await response.json().catch((err)=>{err})
          console.log(errorData)
          const finalMessage = errorData.detail || "An unexpected server error occurred.";
          toast.error(finalMessage)

        }
      }
      catch{
        toast.error("Ur request is not being carried to the brain")
      }


  }

  return (
    <>
    <Toaster position="top-right" />    
    <form>
  <div className="mb-3">
    <label htmlFor="brand" className="form-label">
      Brand
    </label>
    <input
      type="text"
      className="form-control"
      id="brand"
      onChange={(event)=>{
        setCar(prev=>({...prev,"brand":event.target.value}))
                 }
      }
      value={car.brand}

      aria-describedby="emailHelp"
    />
  </div>
  <div className="mb-3">
    <label htmlFor="name" className="form-label">
      Name
    </label>
    <input
      type="text"
      className="form-control"
      onChange={(event)=>{
        setCar(prev=>({...prev,"name":event.target.value}))
      }}
      value={car.name}
      id="name"
    />
  </div>
  <button type="submit" className="btn btn-primary"
  onClick={finup}
  >
    Submit
  </button>
</form>

    </>
  );
}
