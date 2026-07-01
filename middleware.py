from fastapi import Request
import time 
from logVerbose import logger

async def Visible(request:Request,call_next):
  start=time.time()
  response = await call_next(request)
  process_time=time.time()-start
  log_dict={
    "url":request.url.path,
    "method":request.method,
    "process_time":process_time
  }
  logger.info(log_dict,extra=log_dict)
  return response