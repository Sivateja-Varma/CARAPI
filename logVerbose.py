import logging 
import sys
from logtail import LogtailHandler

logger = logging.getLogger("Universal-Logger")
logger.setLevel(logging.DEBUG)

formatter = logging.Formatter(fmt="%(asctime)s - %(message)s - %(levelname)s")

stream=logging.StreamHandler(sys.stdout)
better=LogtailHandler(source_token="uDGqkQjmuN9QLV9dBMWCfou4",host='https://s2515239.eu-fsn-3.betterstackdata.com')
better.setLevel(logging.DEBUG)
file = logging.FileHandler("badreq.log",mode="a")
file.setLevel(logging.ERROR)



logger.addHandler(stream)
logger.addHandler(file)
logger.addHandler(better)

