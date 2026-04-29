from sqlmodel import SQLModel,Field,Session,create_engine
from fastapi import Depends
from typing import Annotated
from enum import Enum
from dotenv import load_dotenv
import os
load_dotenv()

class Roles(str,Enum):
  Admin="Admin"
  Normie="Normie"

class User(SQLModel,table=True):
  id: int | None =Field(primary_key=True,default=None)
  name: str =Field(max_length=100)
  password: str 
  roles : Roles =Field(default=Roles.Normie)

class  UserPost(SQLModel):
  name: str =Field(max_length=100)
  password: str 

class Car(SQLModel,table=True):
  id:int|None = Field(primary_key=True,default=None)
  brand:str = Field(max_length=150,index=True)
  name:str = Field(max_length=150,unique=True)
  image_url:str | None = Field(default=None)

class CarPost(SQLModel):
  brand:str|None = Field(max_length=150)
  name:str = Field(max_length=150,unique=True) 

sql_url=os.getenv("DATABASE_URL",
                  "postgresql+psycopg://postgres:@localhost:5432/fasttoy")
# extra={"check_same_thread":False}

engine=create_engine(sql_url)


def create_db_tables():
  SQLModel.metadata.create_all(engine)

def get_session():
  with Session(engine) as session:
    yield session

SessionDep= Annotated[Session,Depends(get_session)]   



