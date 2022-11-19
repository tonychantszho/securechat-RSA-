import { useEffect, useState } from 'react';

const ChatRoom = ({ name, relativeE, bigN, vefifyResult, socket, setVefifyResult, setCertificate }) => {
    const [vCertificate, setVCertificate] = useState("");
    let init = false;
    useEffect(() => {
        if (!init) {
            socket.on("receive_cert", (data) => {
                setCertificate(data);
            });
            socket.on("varify_cert", (data) => {
                setVefifyResult(data);
            });

            init = true;
        }
        return () => {
            socket.off("receive_cert");
            socket.off("varify_cert");
        }

    }, [bigN, relativeE, vefifyResult]);

    const generateCertificate = () => {
        let username = name;
        const messages = username + ":" + relativeE + "," + bigN;
        socket.emit("generate", messages);
    }

    const varifyCertificate = () => {
        socket.emit("varify", vCertificate);
    }

    return (
        <div className='divBox'>
            <h3>Certificate Authority</h3>
            <table id="noteTable">
                <tbody>
                    <tr>
                        <td><b>generate certificate</b></td>
                        <td><button onClick={generateCertificate}>generate</button></td>
                    </tr>
                </tbody>
            </table>
            <p><b>verify certificate</b></p>
            <table id="noteTable">
                <tr>
                    <td>
                        <input
                            placeholder='certificate...'
                            onChange={(event) => {
                                setVCertificate(event.target.value);
                            }}
                            style={{ width: '100%' }}
                        />
                    </td>
                    <button onClick={varifyCertificate}>verify</button>
                </tr>
            </table>
            <table id="noteTable">
                <tr>
                    <td><b>user name</b></td>
                    <td>{vefifyResult[0]}</td>
                </tr>
                <tr>
                    <td><b>public key</b></td>
                    <td>{vefifyResult[1]}</td>
                </tr>
            </table>
        </div>
    );
}

export default ChatRoom;
