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
        <div>
            <div className='ComponentTitle'>Certificate Authority</div>
            <table className="dataTable">
                <tbody>
                    <tr >
                        <td><b>Generate certificate</b></td>
                        <td><button onClick={generateCertificate}>Generate</button></td>
                    </tr>
                </tbody>
                <tbody>
                    <tr>
                        <td colSpan="2" style={{ textAlign: "center" }}><b>Verify certificate</b></td>
                    </tr>
                </tbody>
                <tbody>
                    <tr>
                        <td>
                            <input
                                placeholder='certificate...'
                                onChange={(event) => {
                                    setVCertificate(event.target.value);
                                }}
                                style={{ width: '100%', boxSizing: "border-box" }}
                            />
                        </td>
                        <td><button onClick={varifyCertificate}>verify</button></td>
                    </tr>
                </tbody>
                <div style={{ fontSize: "15px" }}>
                    <tbody>
                        <tr>
                            <td><b>User name: </b></td>
                            <td>{vefifyResult[0]}</td>
                        </tr>
                    </tbody>
                    <tbody>
                        <tr>
                            <td ><b>Public key: </b></td>
                            <td>{vefifyResult[1]}</td>
                        </tr>
                    </tbody>
                </div>
            </table>
        </div>
    );
}

export default ChatRoom;
