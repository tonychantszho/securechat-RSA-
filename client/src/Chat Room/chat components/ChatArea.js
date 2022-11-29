import { useEffect, useState, useRef } from 'react';
import sendButton from "../img/sendBtn.png";
const ChatArea = ({
    socket,
    name,
    room,
    setRoom,
    message,
    setMessage,
    setEncryptFunc,
    embeddedMessage,
    setEmbeddedMessage
}) => {
    const [messageReceived, setMessageReceived] = useState([{    //store the message received from all users(including the sender)
        name: "System",                                          //initialize message
        message: "Hello!please join one chat room first!"
    }]);
    const chatBottomRef = useRef();
    let init = false;

    useEffect(() => {
        if (!init) {
            socket.on("message_record", (data) => {              //receive message record from server when user join a room
                console.log(data);
                setMessageReceived(data);
            });
            socket.on("receive_message", (data) => {             //receive message from server when any user send a message
                setMessageReceived(data);
            });
            init = true;
        }
    }, [messageReceived, room]);

    useEffect(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, [messageReceived]);

    const userColor = (name) => {                            //set different color for different user
        let uppername = name.toUpperCase();
        if (name.startsWith("A")) {
            return "#e64980";
        } else if (uppername.startsWith("B")) {
            return "#be4bdb";
        } else if (uppername.startsWith("C")) {
            return "#4c6ef5";
        } else if (uppername.startsWith("D")) {
            return "#0ca678";
        } else if (uppername.startsWith("E")) {
            return "#fab005";
        } else {
            return "#fa5252";
        }
    }

    const joinRoom = (selected) => {                     //join a room
        if (room !== "") {
            socket.emit("join_room", selected);         //send room number to server
        }
    };

    const sendMessage = () => {                                     //send message
        if (message != "") {
            document.getElementById("inputMessage1").value = "";    //clear input box
            socket.emit("send_message", { message, room: room, name: name });   //send message,target room and user name to server
            setMessage("");                                         //clear message state
        }
    };

    const sendMessage2 = () => {                                    //send embedded message
        if (embeddedMessage != "") {
            document.getElementById("inputMessage1").value = "";    //clear input box
            socket.emit("send_message", { message: embeddedMessage, room: room, name: name });  //send embedded message,target room and user name to server
            setEmbeddedMessage("");                                 //clear embedded message state
        }
    };
    return (
        <div style={{ padding: "0px" }}>
            <div id="chatRoomBar">
                <div id="charRoomTitle">
                    <label>Chat Room : {room}</label>
                </div>
                <div id="selectRoom">
                    <select
                        style={{ height: "25px" }}
                        onChange={(event) => {
                            setRoom(event.target.value);
                            { joinRoom(event.target.value) };
                        }}>
                        <option value=" "> </option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                    </select>
                </div>
            </div>
            <div id="chatbox">
                {messageReceived?.map((data, i) => {
                    if (data.name != name) {
                        return <div key={i} className="received_message"><b style={{ color: userColor(data.name) }}>{data.name}</b><br />{data.message}</div>
                    } else {
                        return <div key={i} className="my_message"><b style={{ color: "#3bc9db" }}>{data.name}</b><br />{data.message}</div>;
                    }
                })}
                <div ref={chatBottomRef} />
            </div>
            <div id="sendMsg">
                <div>
                    <input
                        id="inputMessage1"
                        placeholder='Message...'
                        onChange={(event) => {
                            setMessage(event.target.value);
                        }}
                    />
                </div>
                <div>
                    <button id="sendBtn" onClick={sendMessage}>
                        <img src={sendButton} style={{ height: "20px", width: "20px" }} />
                    </button>
                </div>
            </div>
            <div style={{ padding: "0px 5px" }}>
                <b>Encrypt message for sending</b>
                <button style={{ marginLeft: '15px' }} onClick={() => { setEncryptFunc("Sign"); }}>Sign</button>
                <button style={{ marginLeft: '15px' }} onClick={() => { setEncryptFunc("encrypt"); }}>encrypt</button>
                <div id="sendMsg" style={{ padding: '0px' }}>
                    <div className="overCell">{embeddedMessage}</div>
                    {embeddedMessage && <div>
                        <button id="sendBtn" style={{ marginTop: "5px" }} onClick={sendMessage2}>
                            <img src={sendButton} style={{ height: "20px", width: "20px" }} />
                        </button>
                    </div>}
                </div>
            </div>
        </div>
    );
}

export default ChatArea;
