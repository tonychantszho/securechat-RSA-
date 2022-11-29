const express = require('express');
const app = express();
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
app.use(cors());

const server = http.createServer(app);
let usersName = [];                 //array to store all users name
let messageRecord1 = [];        //message record for chat room 1
let messageRecord2 = [];        //message record for chat room 2
let messageRecord3 = [];        //message record for chat room 3
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log(`user connected: ${socket.id}`);

    socket.on("checkUserName", (data) => {
        for(let i = 0; i < usersName.length; i++){
            if(data == usersName[i]){
                socket.emit("verify_name", false);
                return;
            }
        }
        usersName.push(data);
        socket.emit("verify_name", true);
    });

    socket.on("join_room", (data) => {
        socket.join(data);
        if (data == "1") {
            io.to(socket.id).emit("message_record", messageRecord1);
        }else if (data == "2") {
            io.to(socket.id).emit("message_record", messageRecord2);
        }else if (data == "3") {
            io.to(socket.id).emit("message_record", messageRecord3);
        }else if (data == "CA") {
            id = socket.id;
        }
    });

    socket.on("send_message", (data) => {
        if (data.room == "1") {
            messageRecord1.push({ name: data.name, message: data.message });
            io.to(data.room).emit("receive_message", messageRecord1);
        }else if (data.room == "2") {
            messageRecord2.push({ name: data.name, message: data.message });
            io.to(data.room).emit("receive_message", messageRecord2);
        }else if (data.room == "3") {
            messageRecord3.push({ name: data.name, message: data.message });
            io.to(data.room).emit("receive_message", messageRecord3);
        }
    });

    socket.on("generate", (data) => {
        socket.to("CA").emit("cert_generate", data,socket.id);
    });

    socket.on("enc_cert", (data) => {
        socket.to(data.socketId).emit("receive_cert", data.encryptedCert);
    });

    socket.on("varify", (data) => {
        socket.to("CA").emit("cert_varify", data,socket.id);
    });

    socket.on("varify_result", (data) => {
        socket.to(data.socketId).emit("varify_cert", data.cert);
    });
})

server.listen(3001, () => {
    console.log('Server is running');
});