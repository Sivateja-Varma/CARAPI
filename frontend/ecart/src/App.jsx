import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Route, Routes, useLocation } from "react-router";
import { GlobalItems,Security } from "./context";
import CreateForm from "./Form";
import UpdateForm from "./Update";
import HomePage from "./Home";
import LoginUser from "./Login";
import ItemView from "./itemView";
import RegisterUser from "./registration";
import Documentation from "./Documentation";

function App() {
  const [token,setToken]=useState("")
  const [items, setItems] = useState([]);
  const location = useLocation();

  useEffect(() => {
    fetch("/api/")
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.log(err));
  }, [location.state]);

  return (
    <Security.Provider value={{token,setToken}}>
    <GlobalItems.Provider value={{items,setItems}}>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <HomePage />

              <div className="car-list-wrapper">
                <ItemView />
              </div>
            </>
          }
        />

        <Route path="/create" element={<CreateForm />} />
        <Route path="/update/:id" element={<UpdateForm />} />
        <Route path="/login" element={<LoginUser />} />
        <Route path="/register" element={<RegisterUser/>}></Route>
        <Route path="/docs" element={<Documentation />} />
      </Routes>
    </GlobalItems.Provider>
    </Security.Provider>
  );
}

export default App;