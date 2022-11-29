import { useEffect, useState } from 'react';

const ChatRoom = ({
    name,
    relativeE,
    bigN,
    vefifyResult,
    socket,
    setVefifyResult,
    setCertificate
}) => {
    const [vCertificate, setVCertificate] = useState("");      // store input certificate by user
    let init = false;
    useEffect(() => {
        if (!init) {
            socket.on("receive_cert", (data) => {              // receive certificate from CA
                setCertificate(data);
            });
            socket.on("varify_cert", (data) => {               // receive varified result from CA
                setVefifyResult(data);
            });

            init = true;
        }
        return () => {
            socket.off("receive_cert");
            socket.off("varify_cert");
        }

    }, [bigN, relativeE, vefifyResult]);

    const generateCertificate = () => {                             // send request to CA to generate certificate
        let username = name;
        const request = username + ":" + relativeE + "," + bigN;    // embed username, relativeE and bigN into request for CA encrypt
        socket.emit("generate", request);                           // send request to CA
    }

    const varifyCertificate = () => {                               // send certificate to CA to varify
        socket.emit("varify", vCertificate);                        // send certificate to CA
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
