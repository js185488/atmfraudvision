import paho.mqtt.publish as publish
import time

BROKER_NAME_TEST = "test.mosquitto.org"
BROKER_NAME = '127.0.0.1'

publish.single("Core1/topic", r"on123", hostname=BROKER_NAME)
time.sleep(3)
publish.single("Core1/topic", r"off123", hostname=BROKER_NAME)
print("Done")