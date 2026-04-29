from fastapi.testclient import TestClient
from fastapi import Depends
import pytest

from app.app import app as fastapi_app,GetUser
from app.db import User,get_session
from sqlmodel import SQLModel,create_engine,Session

sql_data_name="test.db"
sql_url=F"sqlite:///{sql_data_name}"



@pytest.fixture 
def Engine():
  test_engine=create_engine(sql_url,connect_args={"check_same_thread":False})
  SQLModel.metadata.create_all(test_engine)
  yield test_engine
  SQLModel.metadata.drop_all(test_engine)

@pytest.fixture
def OvverideSession(Engine):
  def get_session_fake():
    with Session(Engine) as session:
      yield session    
  fastapi_app.dependency_overrides[get_session]=get_session_fake
  yield
  fastapi_app.dependency_overrides.clear()    


@pytest.fixture
def Get_user():
  user=User(name="sivateja",password="jampana",roles="Admin")
  def givingUser():
    return user
  fastapi_app.dependency_overrides[GetUser]=givingUser
  yield user
  fastapi_app.dependency_overrides.clear()   

@pytest.fixture
def Test_client(OvverideSession,Get_user):
  with TestClient(fastapi_app) as testclient:
    yield testclient  
    





