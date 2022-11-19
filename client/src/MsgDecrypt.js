import { useEffect, useState } from 'react';

const ChatRoom = ({ socket, decrypt, sha256,  bigN, privateD, vefifyResult}) => {
    const [tempCipherText, setTempCipherText] = useState("");
    const [plainText, setPlainText] = useState("");
    const [hashPlainText, setHashPlainText] = useState("");
    const [vDigitalSignature, setVDigitalSignature] = useState("");
    const [confirmedResult, setConfirmedResult] = useState("false");    

    useEffect(() => {
        if (hashPlainText != "") {
            confirmed_result();
        }
    }, [vDigitalSignature]);

    const confirmed_result = () => {
        if (vDigitalSignature == hashPlainText) {
          setConfirmedResult("true");
        } else {
          setConfirmedResult("false");
        }
      }

      const varifySignature = (dSign) => {
        let publicKey = vefifyResult[1].split(",");
        console.log(publicKey);
        let temp = decrypt(dSign, publicKey[0], publicKey[1]);
        console.log(temp);
        setVDigitalSignature(temp);
      }

    const varifyCertificate2 = () => {
        let receivedComponet = tempCipherText.split(",");
        socket.emit("varify", receivedComponet[2]);
    }

    const decryptMessage = () => {
        document.getElementById("inputMessage2").value = "";
        let receivedComponet = tempCipherText.split(",");
        console.log(receivedComponet);
        let padPlainText = decrypt(receivedComponet[0], privateD, bigN);
        const regex = /02\d+00/g;
        const plainText = padPlainText.replace(regex, "");
        let hash = sha256(plainText);
        setHashPlainText(hash);
        setPlainText(plainText);
        varifySignature(receivedComponet[1]);
    }

    return (
        <div className='divBox2'>
            <p><b>Message Decryption</b></p>
            <table id="noteTable">
                <tr>
                    <td>
                        <input
                            id="inputMessage2"
                            placeholder='encrypted message...'
                            onChange={(event) => {
                                setTempCipherText(event.target.value);
                            }}
                            style={{ width: '100%' }}
                        />
                    </td>
                    <button onClick={varifyCertificate2}>verify</button>
                    <button onClick={decryptMessage}>decrypt</button>
                </tr>
            </table>
            <div><b>plain text</b></div>
            <div className="cert">{plainText}</div>
            <br />
            <div><b>decrypted digital signature</b></div>
            <div className="cert">{vDigitalSignature}</div>
            <br />
            <div><b>hash plain text</b></div>
            <div className="cert">{hashPlainText}</div>
            <div>{confirmedResult}</div>
        </div>
    );
}

export default ChatRoom;
