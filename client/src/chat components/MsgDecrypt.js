import { useEffect, useState } from 'react';

const ChatRoom = ({ socket, decrypt, sha256, bigN, privateD, vefifyResult }) => {
    const [tempCipherText, setTempCipherText] = useState("");
    const [plainText, setPlainText] = useState("");
    const [hashPlainText, setHashPlainText] = useState("");
    const [vDigitalSignature, setVDigitalSignature] = useState("");
    const [confirmedResult, setConfirmedResult] = useState("");

    useEffect(() => {
        if (hashPlainText != "") {
            confirmed_result();
        }
    }, [vDigitalSignature]);

    const confirmed_result = () => {
        if (vDigitalSignature == hashPlainText) {
            setConfirmedResult("match");
        } else {
            setConfirmedResult("clash");
        }
    }

    const varifySignature = (dSign) => {
        let publicKey = vefifyResult[1].split(",");
        console.log(publicKey);
        if (publicKey[0] == "failed") {
            publicKey = [1, 1547];
        }
        let temp = decrypt(dSign, publicKey[0], publicKey[1]);
        console.log(temp);
        setVDigitalSignature(temp);
    }

    const varifyCertificate2 = () => {
        let receivedComponet = tempCipherText.split(",");
        console.log(receivedComponet[2]);
        socket.emit("varify", receivedComponet[2]);
    }

    const decryptMessage = () => {
        document.getElementById("inputMessage2").value = "";
        let receivedComponet = tempCipherText.split(",");
        let padPlainText = decrypt(receivedComponet[0], privateD, bigN);
        const regex = /02\d+00/g;
        const plainTextWithKey = padPlainText.replace(regex, "");
        let plainText = plainTextWithKey.split("#%#");
        console.log(plainText);
        if (plainText.length < 2) {
            plainText = ["213", plainText];
        }
        let hash = sha256.hmac(plainText[1], plainText[0]);
        setHashPlainText(hash);
        setPlainText(plainText[0] + " , " + plainText[1]);
        varifySignature(receivedComponet[1]);
    }

    return (
        <div>
            <div className='ComponentTitle'>Message Decryption</div>
            <table className='dataTable2'>
                <tbody>
                    <tr>
                        <td colSpan="2">
                            <input
                                id="inputMessage2"
                                placeholder='encrypted message'
                                onChange={(event) => {
                                    setTempCipherText(event.target.value);
                                }}
                                style={{ width: '100%', boxSizing: "border-box" }}
                            />
                        </td>
                        <td><button onClick={varifyCertificate2}>verify</button></td>
                        <td><button onClick={decryptMessage}>decrypt</button></td>
                    </tr>
                    <tr>
                        <td colSpan="4"><b>Plain text</b></td>
                    </tr>
                    <tr>
                        <td colSpan="4" ><div className='overCell'>{plainText}</div></td>
                    </tr>
                    <tr>
                        <td colSpan="3"><b>Hash using plain text</b></td>
                        {hashPlainText&&<td className="confrimedResult"
                            style={{
                                maxWidth:"70px",
                                color:"white",
                                textAlign: "center",
                                borderRadius: "20px",
                                backgroundColor: confirmedResult === 'clash' ? "red" : "green"
                            }}>
                            {confirmedResult}
                        </td>}
                    </tr>
                    <tr>
                        <td colSpan="4" ><div className='overCell'>{hashPlainText}</div></td>
                    </tr>
                    <tr>
                        <td colSpan="3"><b>Decrypted digital signature</b></td>
                        {hashPlainText&&<td className="confrimedResult"
                            style={{
                                maxWidth:"70px",
                                color:"white",
                                textAlign: "center",
                                borderRadius: "20px",
                                backgroundColor: confirmedResult === 'clash' ? "red" : "green"
                            }}>
                            {confirmedResult}
                        </td>}
                    </tr>
                    <tr>
                        <td colSpan="4" ><div className='overCell'>{vDigitalSignature}</div></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default ChatRoom;
