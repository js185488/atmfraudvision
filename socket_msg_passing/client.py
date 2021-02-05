import socket

USE_LOCAL_HOST = False

if USE_LOCAL_HOST:
    HOST, PORT = 'localhost', 65432
else:
    HOST, PORT = '129.122.173.11', 65432

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect((HOST, PORT))


def sendString(string="Suspicious Activity - ATM Locked"):
    tempString = string.encode()
    s.sendall(tempString)
    data = s.recv(1024)
    print('Received: ', repr(data))


def closeCon():
    s.close()

