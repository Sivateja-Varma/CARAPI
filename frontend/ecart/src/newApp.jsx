import { createContext, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import ItemView from './itemView'
import { Route, Routes, useLocation } from 'react-router'
import { GlobalItems } from './context'
import CreateForm from './Form'
import UpdateForm from './Update'
// import DeleteResource from './Delete'
import HomePage from './Home'
import LoginUser from './Login'


function App() {
  const [items,setItems]=useState([])
  const location = useLocation()
  

  useEffect(()=>{
    fetch('http://127.0.0.1:8000/')
    .then(res=>res.json())
    .then(elements=>{
      return setItems(elements)
    })
  },[location.state])
  return (
   <GlobalItems.Provider value={items}>
    <Routes>

    <Route path="" element={
      <>
      <HomePage></HomePage>
      <div className="container mt-4">
        <div className="row">
   <ItemView></ItemView>
   </div>
   </div>
      </>
      }
      />
     <Route path='/create' element={
      <>
      <CreateForm></CreateForm>
      </>
     }></Route>

     <Route path='/update/:id' Component={UpdateForm}/>
     {/* <Route path="/delete/:id" Component={DeleteResource}></Route> */}
     <Route path="/login" Component={LoginUser}></Route>
    </Routes>
  </GlobalItems.Provider>
  )
}

export default App
