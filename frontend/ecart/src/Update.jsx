import React, { useEffect, useState } from 'react';
import { Form, useNavigate, useParams } from 'react-router';
import toast, {Toaster} from 'react-hot-toast'

export default function UpdateForm() {
  let param = useParams()
  const [car,setCar]=useState({brand:"",name:""})
  const [filecont,setFilecont]=useState(null)
  const navigate = useNavigate()
  // const [data,setData] = useState(null) 
  // console.log(data)

  async function finup(event){
      event.preventDefault();
      // setData(prev=>({...prev,car}))
      const formData = new FormData()
      formData.append('brand', car.brand);
      formData.append('name', car.name);
    if (filecont) {
      formData.append('upload', filecont);
    }
      try{
        const response = await fetch(`/api/updateCar/${param.id}`,{
          method:"PUT",

          body:formData
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
  <div className="mb-3">
    <label htmlFor="file" className="form-label">
      File
    </label>
    <input
      type="file"
      className="form-control"
      
      onChange={(event)=>{setFilecont(event.target.files[0])}}
      id="file" />
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
