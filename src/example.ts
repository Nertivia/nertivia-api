import {Client} from './';

const client = new Client();

client.socket.on("CLIENT:READY", () => {
    client.users.state["id"].username
})

client.socket.on("MESSAGE:SEND", message => {
    console.log(message.content)
})

client.login("token")