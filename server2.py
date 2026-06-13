import socket
import threading

host = "127.0.0.1"
port = 5555

server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind((host, port))
server.listen()
clients = []
names = []

def broadcast(message, sender_client=None):
    for client in clients:
        if client != sender_client:
            try:
                client.send(message)
            except:
                pass

def private_message(message, sender_name):
    try:
        msg = message.decode()

        if msg.startswith("@"):
            parts = msg.split(" ", 1)
            target_name = parts[0][1:]   # remove '@'
            actual_msg = parts[1] if len(parts) > 1 else ""
            if target_name in names:
                target_index = names.index(target_name)
                target_client = clients[target_index]
                target_client.send(f"[DM from {sender_name}]: {actual_msg}".encode())
            else:
                sender_index = names.index(sender_name)
                sender_client = clients[sender_index]
                sender_client.send(f"User '{target_name}' not found.".encode())

            return True
    except:
        pass

    return False


def handle(client):
    while True:
        try:
            message = client.recv(1024)
            if not message:
                raise Exception()

            sender_index = clients.index(client)
            sender_name = names[sender_index]

            # check if private message
            if private_message(message, sender_name):
                continue

            # otherwise broadcast (public)
            broadcast(f"{sender_name}: {message.decode()}".encode(), client)

        except:
            index = clients.index(client)
            clients.remove(client)
            client.close()

            name = names[index]
            names.remove(name)

            broadcast(f"{name} left chat.".encode())
            break


def receive():
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
receive()