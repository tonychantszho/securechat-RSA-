import { useEffect, useState } from 'react';

const ChatRoom = ({
    socket,
    decrypt,
    sha256,
    bigN,
    privateD,
    vefifyResult
}) => {
    const [tempCipherText, setTempCipherText] = useState("");       //store input ciphertext by user
    const [plainText, setPlainText] = useState("");                 //store plaintext after decryption
    const [hashPlainText, setHashPlainText] = useState("");         //store hash value afte hash plaintext
    const [vDigitalSignature, setVDigitalSignature] = useState(""); //store digital signature after decryption
    const [confirmedResult, setConfirmedResult] = useState("");     //store result of compare hash value and digital signature

    useEffect(() => {
        if (hashPlainText != "") {                                // if hash value is not empty, compare hash value and digital signature
            confirmed_result();
        }
    }, [vDigitalSignature]);

    const confirmed_result = () => {                    // compare hash value and digital signature
        if (vDigitalSignature == hashPlainText) {       // if hash value and digital signature are the same, set confirmed result to true
            setConfirmedResult("match");
        } else {                                        // if hash value and digital signature are not the same, set confirmed result to false
            setConfirmedResult("clash");
        }
    }

    const varifySignature = (dSign) => {                // varify digital signature is actually signed by sender
        let publicKey = vefifyResult[1].split(",");     // get public key from certificate
        console.log(publicKey);
        if (vefifyResult[0] == "failed" || publicKey == "") {   // if certificate is not valid, set public key to invaild value
            publicKey = [1, 1547];
        }
        let temp = decrypt(dSign, publicKey[0], publicKey[1]);  // decrypt digital signature using sender public key
        console.log(temp);
        setVDigitalSignature(temp);
    }

    const varifyCertificate2 = () => {                      // varify certificate is valid
        let receivedComponet = tempCipherText.split(",");   // split ciphertext into 3 parts,get the third part(certificate)
        console.log(receivedComponet[2]);
        socket.emit("varify", receivedComponet[2]);         // send certificate to CA to varify
    }

    const decryptMessage = () => {                              // decrypt received ciphertext
        document.getElementById("inputMessage2").value = "";    // clear input ciphertext
        let receivedComponet = tempCipherText.split(",");       // split ciphertext into 3 parts
        if (receivedComponet.length != 3) {                     // if ciphertext is not equal to 3 parts, return invalid value
            receivedComponet = ["321", "432433", "3243"];
        }
        let padPlainText = decrypt(receivedComponet[0], privateD, bigN);    // decrypt ciphertext using private key
        const regex = /02\d+00/g;                                           // remove padding from decrypted plaintext
        const plainTextWithKey = padPlainText.replace(regex, "");
        let plainText = plainTextWithKey.split("#%#");                      //split plaintext and session key
        console.log(plainText);
        if (plainText.length < 2) {                                        // if plaintext did not include session key, return invalid value
            plainText = ["213", plainText];
        }
        let hash = sha256.hmac(plainText[1], plainText[0]);                 // hash plaintext with session key
        setHashPlainText(hash);
        setPlainText(plainText[0] + " , " + plainText[1]);
        varifySignature(receivedComponet[1]);                               // varify digital signature
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
                        {hashPlainText && <td className="confrimedResult"
                            style={{
                                maxWidth: "70px",
                                color: "white",
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
                        {hashPlainText && <td className="confrimedResult"
                            style={{
                                maxWidth: "70px",
                                color: "white",
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
