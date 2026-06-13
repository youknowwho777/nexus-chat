import socket
import threading

host = "127.0.0.1"
port = 5555
name = input("Enter your name: ")
client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
client.connect((host, port))

def recieve():
    while True:
        try:
            message = client.recv(1024).decode()
            if message == "NAME":
                client.send(name.encode())
            else:
                print(message)
        except:
            print("Disconnected")
            client.close()
            break

def write():
    while True:
        message = f"{name}: {input('')}"
        client.send(message.encode())
        
threading.Thread(target=recieve).start()
threading.Thread(target=write).start()