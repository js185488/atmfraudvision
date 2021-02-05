import socketserver
import socket
from tkinter import messagebox


USE_LOCAL_HOST = False

if USE_LOCAL_HOST:
    HOST, PORT = 'localhost', 65432
else:
    HOST, PORT = '129.122.173.11', 65432


#https://stackoverflow.com/questions/8627986/how-to-keep-a-socket-open-until-client-closes-it
class MyTCPHandler(socketserver.BaseRequestHandler):
    def handle(self):
        while True:
            data = self.request.recv(1024)
            if not data:
                break
            data = data.strip() # no false alarm due to the client sending only white space
            dataString = data.decode()
            print(str(self.client_address[0]) + " wrote: " + dataString)
            self.request.sendall(data)
            messagebox.showerror("Error", dataString)


if __name__ == "__main__":
    print("Host IP is: " + socket.gethostbyname(socket.gethostname()))
    server = socketserver.TCPServer((HOST, PORT), MyTCPHandler)
    server.serve_forever()
