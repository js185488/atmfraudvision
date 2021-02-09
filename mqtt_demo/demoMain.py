from mqttClient import startMqttClient
from errorQueue import popErrMsg
import threading
from tkinter import messagebox


def showError():
    while True:
        errMsg = popErrMsg()
        if errMsg:
            messagebox.showerror("Error", errMsg)


if __name__ == "__main__":
    # startMqttClient will connect to the MQTT broker and monitor for subscribed topics
    # it will queue an error message for the main thread to show a pop-up window with the
    # topic's payload. NOTE: tkinter GUI has to reside in the main (this) thread
    t = threading.Thread(target=startMqttClient, daemon=True)
    t.start()
    showError()