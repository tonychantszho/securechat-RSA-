import { useEffect, useState, useRef } from 'react';
import background from "./img/wallpaper2.png";
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
                    style={{height: "25px"}}
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
            <div id="chatbox" style={{ backgroundImage: `url(${background})` }}>
                {messageReceived?.map((data, i) => {
                    if (data.name != name) {
                        return <div key={i} className="received_message"><b style={{ color: "red" }}>{data.name}</b><br />{data.message}</div>
                    } else {
                        return <div key={i} className="my_message"><b style={{ color: "black" }}>{data.name}</b><br />{data.message}</div>;
                    }
                })}
                <div ref={chatBottomRef} />
            </div>
            <table id="noteTable">
                <tbody>
                    <tr>
                        <td>
                            <input
                                id="inputMessage1"
                                placeholder='Message...'
                                onChange={(event) => {
                                    setMessage(event.target.value);
                                }}
                                style={{ width: "100%" }}
                            />
                        </td>
                        <td>
                            <button onClick={sendMessage}>Send Message</button>
                        </td>
                    </tr>
                </tbody>
                <tbody>
                    <tr>
                        <td><button onClick={() => { setEncryptFunc("Sign"); }}>Sign</button></td>
                        <td><button onClick={() => { setEncryptFunc("encrypt"); }}>encrypt</button></td>
                    </tr>
                </tbody>
            </table>
            <div><b>message for sending</b></div>
            <div className="cert">{embeddedMessage}</div>
            <button onClick={() => { setEncryptFunc("encrypt"); }}>encrypt</button>
        </div>
    );
}

export default ChatRoom;
