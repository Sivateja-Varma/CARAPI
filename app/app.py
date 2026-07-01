from fastapi import FastAPI,status,HTTPException,Depends
from fastapi.security import HTTPBearer
from .db import SessionDep,CarPost,Car
from sqlmodel import select
from passlib.context import CryptContext 
from datetime import datetime
from datetime import UTC,timedelta,timezone
from jose import jwt,JWTError,JWSError
from typing import TypeVar,Generic,List,Annotated
from pydantic import BaseModel
from .db import User,UserPost,Roles
from fastapi import Form,UploadFile,File,Request
import os 
from fastapi import Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from starlette.middleware.base import BaseHTTPMiddleware
from middleware import Visible
load_dotenv()
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)



# config = SecurityConfig(
#     rate_limit=100,
#     enable_redis=False)
#    #  redis_url="redis://localhost:6379",
#    #  redis_prefix="redisStore"  )
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="CarMart API",
    description="""
# CarMart REST API

A REST API for managing cars with authentication.

## Features

- JWT Authentication
- Role Based Authorization
- CRUD Operations
- Image Uploads
- Static Image Hosting
- PostgreSQL
- SQLModel

## Authentication

Login first.

Copy the returned JWT.

Use it like

Authorization:

Bearer YOUR_TOKEN
""",
    version="1.0.0",
    contact={
        "name":"Sivateja Varma",
        "email":"example@gmail.com"
    }
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.mount("/uploads",StaticFiles(directory="uploads"),name="uploads")

app.add_middleware(BaseHTTPMiddleware,dispatch=Visible)

# app.add_middleware(SecurityMiddleware,config=config)

origins = [
    "*"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)






hashing=CryptContext(schemes=['bcrypt'],deprecated="auto")

SECRET_PASSWORD=os.getenv("SECRET_PASSWORD")
ALGORITHM="HS256"

def HashPass(password:str):
   return hashing.hash(password)
def VerifyPass(loginpass:str,password:str):
   return hashing.verify(password,hash=loginpass)
def GetAccessToken(data:dict):
   token=data.copy()
   exp=datetime.now(timezone.utc)+timedelta(minutes=30)
   token.update({"exp":exp})
   return jwt.encode(token,SECRET_PASSWORD,algorithm=ALGORITHM)
def Decrypt(token:str):
   try:
      payload= jwt.decode(token,SECRET_PASSWORD,algorithms=(ALGORITHM))
      return payload
   except JWTError as e:
      raise HTTPException(detail=str(e),status_code=status.HTTP_401_UNAUTHORIZED)
   


secure=HTTPBearer()

def GetUser(
      session:SessionDep,
      token=Depends(secure)
):
   payload=Decrypt(token.credentials)
   if payload:
      id=payload.get('id')
      user=session.get(User,id)
      return user
   
def Allowed(allowed:List[str]):
   def Permitted(user:User=Depends(GetUser)):
      if user.roles in allowed:
         return user
      else:
         raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail="take a walk Normie")
   return Permitted   



@app.post('/register',tags=['REGISTER USER'],summary='USER REGISTERY ENDPOINT',
          description='REGISTER A BRAND NEW USERT',status_code=status.HTTP_201_CREATED)
@limiter.limit('5/minute')
async def Register(request:Request,session:SessionDep,user:UserPost):
  try:
    chap=User(
      name=user.name,
      password=HashPass(user.password),
      roles=Roles.Admin
    )
    session.add(chap)
    session.commit()
    session.refresh(chap)
  except Exception as e:  
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail=str(e)) 
  
@app.post("/login",tags=['LOGIN USER'],summary='USER LOGIN ENDPOINT',description='USER LOGIN RETURNS A JWT TOKEN WHICH IS NEDDED FOR DELETE',status_code=status.HTTP_202_ACCEPTED)
@limiter.limit('5/minute')
async def Login(request:Request,session:SessionDep,user:UserPost):
   statement=select(User).where(User.name==user.name)
   chap=  session.exec(statement).first()
   if not chap or not VerifyPass(chap.password,user.password):
      raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
   access_token=GetAccessToken({"id":chap.id})
   return {"access_token":access_token}









T=TypeVar("T")
class ResponseObj(BaseModel,Generic[T]):
   data:T

@app.get("/",status_code=status.HTTP_200_OK,tags=['GET DATA'],summary='GET ALL THE DATA THROUGH THIS ENDPOINT',description='GET ALL THE DATA OF CARS')
async def Home(session:SessionDep):
  cars = session.exec(select(Car)).all()
  return cars

@app.get("/singleCar/{id}",status_code=status.HTTP_200_OK,tags=['GET DATA'],summary='SINGLE CAR INFO ENDPOINT',description='CAR IS GIVEN BASED ON ID IF NOT 404 IS RAISED ')
async def singleCar(session:SessionDep,id:int):
   car=session.get(Car,id)
   if not car:
      raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
   return car

@app.post("/createCar",status_code=status.HTTP_201_CREATED,tags=['CREATE CAR'],summary='CAR CREATION ENDPOINT',description='CREATE A CAR THE NAME SHOULD BE UNIQUE CHECK BEFORE ADDING ON THE FRONT END')
async def CreateCar(session:SessionDep,brand:str=Form(...),name:str=Form(...),image:UploadFile=File(None)):
   try:
      print(Request.method)
      image_url=None
      if image:
         file_path = os.path.join(UPLOAD_DIR, image.filename)
         with open(file_path,'wb') as f:
            f.write( await image.read())
         image_url=f"{os.getenv("ENTIRE_URL")}/{file_path}"  

      car=Car(
         brand=brand,
         name=name,
         image_url=f"{image_url}"
      )
      session.add(car)
      session.commit()
      session.refresh(car)
      return car
   except Exception as e:
      raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail=str(e))   

@app.put("/updateCar/{id}",status_code=status.HTTP_200_OK,tags=['UPDATE DATA'],summary='UPDATE THROUGH THIS ENDPOINT',description='GET ALL THE DATA OF CARS')
async def UpdateCar(session:SessionDep,id:int,brand:Annotated[str|None,Form()]=None,name:Annotated[str|None,Form()]=None,upload:UploadFile=(File(None))):
   car = session.get(Car,id)
   IMAGE_URL=car.image_url
   if brand:
      car.brand=brand
   if name:  
      car.name=name
   if upload:
      IMAGE_URL=IMAGE_URL.replace(os.getenv("ENTIRE_URL"),"")
      print(IMAGE_URL)
      print("I am here 2")
      if os.path.exists(IMAGE_URL):
         print("i am here ")
         os.remove(IMAGE_URL)
      file_path = os.path.join(UPLOAD_DIR, upload.filename)
      with open(file_path,"wb") as f:
         f.write(await upload.read())  
      car.image_url=f"{os.getenv("ENTIRE_URL")}/{file_path}"   

   try:
      session.add(car)
      session.commit()
      session.refresh(car)
      return car
   except Exception as e:
      raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="bad request") 
   

  

   
@app.delete("/DeleteCar/{id}",status_code=status.HTTP_204_NO_CONTENT,tags=['DELETE DATA'],summary='DELETE THE DATA THROUGH THIS ENDPOINT',description='INORDER TO DELETE FIRST LOGIN')
async def DeleteCar(session:SessionDep,id:int,user=Depends(Allowed([Roles.Admin]))):
   try:
      car=session.get(Car,id)
      IMAGE_URL=car.image_url
      session.delete(car)
      session.commit()

      if IMAGE_URL:
         print(IMAGE_URL)
         try:
            print("I am here")
            IMAGE_URL=IMAGE_URL.replace(os.getenv("ENTIRE_URL"),"")
            print(IMAGE_URL)
            print("I am here 2")
            if os.path.exists(IMAGE_URL):
               print("i am here ")
               os.remove(IMAGE_URL)
         except Exception as e:
            print(e)   


   except Exception as e:
      raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail=str(e))   
