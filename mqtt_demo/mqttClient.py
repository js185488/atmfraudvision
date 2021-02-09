import paho.mqtt.client as mqtt
from errorQueue import queueErrMsg

BROKER_NAME_TEST = "test.mosquitto.org"
BROKER_NAME = 'localhost'


def on_connect(client, userdata, flags, rc):
    print("Connected with result " + str(rc))
    client.subscribe("Core1/topic")


def on_message(client, userdata, msg):
    strMsg = str(msg.payload)
    print(msg.topic + " " + strMsg)
    queueErrMsg(strMsg)


def startMqttClient():
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message

    client.connect(BROKER_NAME, 1883, 60)
    client.loop_forever()
