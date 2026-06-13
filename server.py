import socket
import threading

host = "127.0.0.1"
port = 5555
server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind((host, port))
server.listen()
clients = []
names = []

def broadcast(message):
    for client in clients:
        try:
            client.send(message)
        except:
            pass

def handle(client):
    while True:
        try:
            message = client.recv(1024)
            if not message:
                raise Exception()  
            broadcast(message)
        except:
            index = clients.index(client)
            clients.remove(client)
            client.close()
            name = names[index]
            broadcast(f"{name} left chat.".encode())
            names.remove(name)
            break

def recieve():
    while True:
        client, addr = server.accept()
        print("Connected with", str(addr))
        client.send("NAME".encode())
        name = client.recv(1024).decode()
        names.append(name)
        clients.append(client)
        print(name, "joined.")
        broadcast(f"{name} joined the chat.".encode())
        thread = threading.Thread(target=handle, args=(client,))
        thread.start()
print("Server started...")
recieve()