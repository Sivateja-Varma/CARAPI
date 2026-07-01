import "./Documentation.css";
import CodeBlock from "./CodeBlock";
import { useState } from "react";

export default function Documentation() {
  const [tab, setTab] = useState("javascript");
  const BASE_URL = "http://32.236.44.143";

  const snippets = {
    javascript: `const response = await fetch("http://32.236.44.143/api/login",{
    method:"POST",
    headers:{
        "Content-Type":"application/json"
    },
    body:JSON.stringify({
        name:"john",
        password:"secret"
    })
});

const data = await response.json();

localStorage.setItem("token",data.access_token);`,

    axios: `import axios from "axios";

const response = await axios.post(
"http://32.236.44.143/api/login",
{
    name:"john",
    password:"secret"
});

localStorage.setItem(
"token",
response.data.access_token
);`,

    python: `import requests

response = requests.post(
"http://32.236.44.143/api/login",
json={
    "name":"john",
    "password":"secret"
})

print(response.json())`,

    curl: `curl -X POST http://32.236.44.143/api/login \\
-H "Content-Type: application/json" \\
-d '{"name":"john","password":"secret"}'`,
  };

  return (
    <div className="documentation">

      <aside className="sidebar">

        <h2>CarMart</h2>

        <a href="#intro">Introduction</a>

        <a href="#base">Base URL</a>

        <a href="#auth">Authentication</a>

        <a href="#register">Register</a>

        <a href="#login">Login</a>

        <a href="#cars">Cars</a>

        <a href="#swagger">Swagger</a>

      </aside>

      <main className="content">

        <section id="intro">

          <h1>CarMart API Documentation</h1>

          <p>
            Welcome to the CarMart REST API.
            This API allows developers to manage
            cars, upload images and authenticate users
            using JWT Authentication.
          </p>

        </section>

        <section className="card" id="base">

          <h2>Base URL</h2>

          <CodeBlock>

{`GET ${BASE_URL}/api`}

</CodeBlock>

        </section>

        <section className="card" id="auth">

          <h2>Authentication</h2>

          <p>

Every protected endpoint requires a JWT access token.

          </p>

          <CodeBlock>

Authorization: Bearer YOUR_TOKEN

          </CodeBlock>

        </section>

        <section className="card">

          <h2>Quick Example</h2>

          <div className="tabs">

            <button
              className={tab==="javascript" ? "active" : ""}
              onClick={()=>setTab("javascript")}
            >
              JavaScript
            </button>

            <button
              className={tab==="axios" ? "active" : ""}
              onClick={()=>setTab("axios")}
            >
              Axios
            </button>

            <button
              className={tab==="python" ? "active" : ""}
              onClick={()=>setTab("python")}
            >
              Python
            </button>

            <button
              className={tab==="curl" ? "active" : ""}
              onClick={()=>setTab("curl")}
            >
              cURL
            </button>

          </div>

          <CodeBlock>

{snippets[tab]}

          </CodeBlock>

        </section>

        <section
        className="endpoint"
        id="register"
        >

          <div className="endpoint-header">

            <span className="method post">

POST

            </span>

            <h2>

Register User

            </h2>

          </div>

          <p>

Creates a new user account.

          </p>

          <h4>

Endpoint

          </h4>

<CodeBlock>

{`POST ${BASE_URL}/api/register`}

</CodeBlock>

          <h4>

Request Body

          </h4>

          <CodeBlock>

{`{
    "name":"john",
    "password":"secret"
}`}

          </CodeBlock>

          <h4>

Response

          </h4>

          <CodeBlock>

201 CREATED

          </CodeBlock>

        </section>

        <section
        className="endpoint"
        id="login"
        >

          <div className="endpoint-header">

            <span className="method post">

POST

            </span>

            <h2>

User Login

            </h2>

          </div>

          <p>

Returns a JWT access token.

          </p>

          <h4>

Endpoint

          </h4>

<CodeBlock>

{`POST ${BASE_URL}/api/login`}

</CodeBlock>

          <h4>

Body

          </h4>

          <CodeBlock>

{`{
    "name":"john",
    "password":"secret"
}`}

          </CodeBlock>

          <h4>

Example Response

          </h4>

          <CodeBlock>

{`{
    "access_token":"eyJhbGciOiJIUzI1..."
}`}

          </CodeBlock>
        </section>

        <section
        className="endpoint"
        id="cars"
        >

          <div className="endpoint-header">

            <span className="method get">

GET

            </span>

            <h2>

Get All Cars

            </h2>

          </div>

          <p>

Returns every car available in the database.

          </p>

          <h4>

Endpoint

          </h4>

          <CodeBlock>

GET /

          </CodeBlock>

          <h4>

Example Response

          </h4>

          <CodeBlock>

{`[
    {
        "id":1,
        "brand":"BMW",
        "name":"M3",
        "image_url":"http://32.236.44.143/uploads/bmw.png"
    },
    {
        "id":2,
        "brand":"Toyota",
        "name":"Supra",
        "image_url":"http://32.236.44.143/uploads/supra.png"
    }
]`}

          </CodeBlock>

        </section>





        <section className="endpoint">

          <div className="endpoint-header">

            <span className="method get">

GET

            </span>

            <h2>

Get Single Car

            </h2>

          </div>

          <p>

Retrieve a specific car by its id.

          </p>

          <h4>

Endpoint

          </h4>

<CodeBlock>

{`GET ${BASE_URL}/api/singleCar/1`}

</CodeBlock>

          <h4>

Response

          </h4>

          <CodeBlock>

{`{
    "id":1,
    "brand":"BMW",
    "name":"M3",
    "image_url":"http://32.236.44.143/uploads/bmw.png"
}`}

          </CodeBlock>

        </section>






        <section className="endpoint">

          <div className="endpoint-header">

            <span className="method post">

POST

            </span>

            <h2>

Create Car

            </h2>

          </div>

          <p>

Creates a new car. Authentication required.

          </p>

          <h4>

Endpoint

          </h4>

<CodeBlock>

{`POST ${BASE_URL}/api/createCar`}

</CodeBlock>

          <h4>

Content Type

          </h4>

          <CodeBlock>

multipart/form-data

          </CodeBlock>

          <h4>

Fields

          </h4>

          <CodeBlock>

{`brand : Toyota
name  : Supra
image : File`}

          </CodeBlock>

        </section>






        <section className="endpoint">

          <div className="endpoint-header">

            <span className="method put">

PUT

            </span>

            <h2>

Update Car

            </h2>

          </div>

          <p>

Updates an existing car.

          </p>

          <h4>

Endpoint

          </h4>

<CodeBlock>

{`PUT ${BASE_URL}/api/updateCar/1`}

</CodeBlock>

          <h4>

Content Type

          </h4>

          <CodeBlock>

multipart/form-data

          </CodeBlock>

          <h4>

Fields

          </h4>

          <CodeBlock>

{`brand : Toyota
name  : GR Supra
image : File (optional)`}

          </CodeBlock>

        </section>






        <section className="endpoint">

          <div className="endpoint-header">

            <span className="method delete">

DELETE

            </span>

            <h2>

Delete Car

            </h2>

          </div>

          <p>

Deletes a car. Admin authentication required.

          </p>

          <h4>

Endpoint

          </h4>

<CodeBlock>

{`DELETE ${BASE_URL}/api/DeleteCar/1`}

</CodeBlock>

          <h4>

Authorization

          </h4>

          <CodeBlock>

Authorization: Bearer YOUR_TOKEN

          </CodeBlock>

        </section>







        <section
        className="card"
        id="swagger"
        >

          <h2>

Interactive Documentation

          </h2>

          <p>

CarMart also provides interactive API documentation powered by FastAPI.

          </p>

          <div className="link-box">

            <strong>

Swagger UI

            </strong>

            <CodeBlock>

http://32.236.44.143/docs

            </CodeBlock>

          </div>

          <div className="link-box">

            <strong>

ReDoc

            </strong>

            <CodeBlock>

http://32.236.44.143/redoc

            </CodeBlock>

          </div>

        </section>

      </main>

    </div>

  );

}
