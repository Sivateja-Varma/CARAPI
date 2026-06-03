from fastapi import FastAPI,status,HTTPException,Depends
from fastapi.security import HTTPBearer
from .db import SessionDep,CarPost,Car
from sqlmodel import select
from passlib.context import CryptContext 
from datetime import datetime
from datetime import UTC,timedelta,timezone
from jose import jwt,JWTError,JWSError
from typing import TypeVar,Generic,List
from pydantic import BaseModel
from .db import User,UserPost,Roles
from fastapi import Form,UploadFile,File,Request
import os 
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
load_dotenv()
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
import logging 

logging.basicConfig(filename="badreq.log",filemode="w")



app=FastAPI()
app.mount("/uploads",StaticFiles(directory="uploads"),name="uploads")

origins = [
    "http://localhost:5173",
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



@app.post('/register',status_code=status.HTTP_201_CREATED)
async def Register(session:SessionDep,user:UserPost):
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
  
@app.post("/login",status_code=status.HTTP_202_ACCEPTED)
async def Login(session:SessionDep,user:UserPost):
   statement=select(User).where(User.name==user.name)
   chap=  session.exec(statement).first()
   if not chap or not VerifyPass(chap.password,user.password):
      raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
   access_token=GetAccessToken({"id":chap.id})
   return {"access_token":access_token}









T=TypeVar("T")
class ResponseObj(BaseModel,Generic[T]):
   data:T

@app.get("/",status_code=status.HTTP_200_OK)
async def Home(session:SessionDep):
  cars = session.exec(select(Car)).all()
  return cars

@app.get("/singleCar/{id}",status_code=status.HTTP_200_OK)
async def singleCar(session:SessionDep,id:int):
   car=session.get(Car,id)
   if not car:
      raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
   return car

@app.post("/createCar",status_code=status.HTTP_201_CREATED)
async def CreateCar(session:SessionDep,brand:str=Form(...),name:str=Form(...),image:UploadFile=File(None)):
   try:
      print(Request.method)
      image_url=None
      if image:
         file_path = os.path.join(UPLOAD_DIR, image.filename)
         with open(file_path,'wb') as f:
            f.write( await image.read())
         image_url=file_path   

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

@app.put("/updateCar/{id}",status_code=status.HTTP_200_OK)
async def UpdateCar(session:SessionDep,carData:CarPost,id:int):
  try:
    car = session.get(Car,id)
    if car:
      car.brand=carData.brand
      car.name=carData.name
      try:
         session.add(car)
         session.commit()
         session.refresh(car)
         return car
      except Exception as e:
         logging.error(str(e))
         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="bad request")

  except Exception as e:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail=str(e)) 

   
@app.delete("/DeleteCar/{id}",status_code=status.HTTP_204_NO_CONTENT)
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
            # IMAGE_URL=IMAGE_URL.replace(os.getenv("ENTIRE_URL"),"")
            print(IMAGE_URL)
            print("I am here 2")
            if os.path.exists(IMAGE_URL):
               print("i am here ")
               os.remove(IMAGE_URL)
         except Exception as e:
            print(e)   


   except Exception as e:
      raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail=str(e))   
