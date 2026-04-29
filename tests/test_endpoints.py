
def test_Update_Car(Test_client):
  payload={"brand":"maruthi","name":"waganor"}
  with open("uploads/image1.jpeg",'rb') as f:
    response=Test_client.post("/createCar",data=payload,files={"image":(
      "image1.jpeg",f,"image/jpeg")}
    )
  assert response.status_code == 201
  data=response.json()
  id =data.get("id")

  response=Test_client.put(f"/updateCar/{id}",json={"brand":"maruthi","name":"brezza"})
  
  assert response.status_code==200
  dataByte=response.json()
  assert dataByte.get("name")=="brezza"









def test_getCar(Test_client):
  payload={"brand":"ferrari","name":"enzo"}

  with open('uploads/image1.jpeg','rb') as f:
    
    response=Test_client.post("/createCar",data=payload,files={"image":(
      "image1.jpeg",f,"image/jpeg"
    )})
  
  

  assert response.status_code== 201
  data=response.json()
  id=data.get("id")

  response= Test_client.get(F"/singleCar/{id}")
  assert response.status_code==200
  dataByte=response.json()
  # assert dataByte["image_url"]=="http://127.0.0.1:8000/uploads/image1.jpeg"

def test_DeleteCar(Test_client):
  payload={"brand":"maruthi","name":"waganor"}
  with open("uploads/image1.jpeg",'rb') as f:
    response=Test_client.post("/createCar",data=payload,files={"image":("image1.jpeg",f,"image/jpeg")}) 
    assert response.status_code == 201
    data=response.json()
    id=data.get('id')

    response=Test_client.delete(f'DeleteCar/{id}')
    assert response.status_code == 204


