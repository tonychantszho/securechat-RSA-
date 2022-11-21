import { useEffect, useState, useRef } from 'react';
import sendButton from "./img/sendBtn.png";
const ChatRoom = ({
    socket,
    name,
    room,
    setRoom,
    message,
    setMessage,
    setEncryptFunc,
    embeddedMessage
}) => {
    const [messageReceived, setMessageReceived] = useState([{ name: "system", message: "hello" }]);
    const chatBottomRef = useRef();
    let init = false;

    useEffect(() => {
        if (!init) {
            socket.on("message_record", (data) => {
                console.log(data);
                setMessageReceived(data);
            });
            socket.on("receive_message", (data) => {
                setMessageReceived(data);
            });
            init = true;
        }
    }, [messageReceived, room]);

    useEffect(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, [messageReceived]);

    const userColor = (name) => {
        let uppername = name.toUpperCase();
        console.log(uppername);
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

    const joinRoom = (selected) => {
        console.log(selected);
        if (room !== "") {
            socket.emit("join_room", selected);
        }
    };

    const sendMessage = () => {
        document.getElementById("inputMessage1").value = "";
        socket.emit("send_message", { message, room: room, name: name });
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
                    <button id="sendBtn" onClick={sendMessage}><img src={sendButton} style={{ height: "20px", width: "20px" }} /></button>
                </div>
            </div>
            <div style={{ padding: "0px 5px" }}>
                <b>Encrypt message for sending</b>
                <button style={{ marginLeft: '15px' }} onClick={() => { setEncryptFunc("Sign"); }}>Sign</button>
                <button style={{ marginLeft: '15px' }} onClick={() => { setEncryptFunc("encrypt"); }}>encrypt</button>
                <div id="sendMsg" style={{ padding:'0px' }}>
                    <div className="overCell" >{embeddedMessage}</div>
                    <div>
                        <button style={{ marginTop: '5px' }} onClick={() => { setEncryptFunc("encrypt"); }}>encrypt</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatRoom;
