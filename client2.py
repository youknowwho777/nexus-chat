import socket
import threading
host = "127.0.0.1"
port = 5555
client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
client.connect((host, port))


def receive():
    while True:
        try:
            message = client.recv(1024).decode()
            if message == "NAME":
                name = input("Enter your name: ")
                client.send(name.encode())
            else:
                print(message)
        except:
            print("Disconnected from server.")
            client.close()
            break

def write():
    while True:
        msg = input("")
        # (server will decide public or private)
        client.send(msg.encode())

receive_thread = threading.Thread(target=receive)
receive_thread.start()
write_thread = threading.Thread(target=write)
write_thread.start()