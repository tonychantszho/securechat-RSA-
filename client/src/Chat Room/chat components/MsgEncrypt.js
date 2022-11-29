import { useEffect, useState } from 'react';

const MsgEncrypt = ({
    privateD,
    bigN,
    sha256,
    certificate,
    encrypt,
    sessionKey,
    message,
    setEncryptFunc,
    encryptFunc,
    vefifyResult,
    setEmbeddedMessage
}) => {
    const [hashValue, setHashValue] = useState("");     // store hash value of message
    const [digitalSignature, setDigitalSignature] = useState("");   // store digital signature of message
    const [cipherText, setCipherText] = useState("");   // store cipher text of message

    useEffect(() => {                               // when user press sign or encrypt button, excute corresponding function
        if (encryptFunc != "") {
            console.log(encryptFunc);
            if (encryptFunc == "Sign") {            // if sing button is clicked,sign message
                console.log("Sign");
                hashAndSign();
            } else if (encryptFunc == "encrypt") {  // if encrypt button is clicked, encrypt message
                console.log("encrypt");
                encryptMessage();
            }
        }
        setEncryptFunc("");
    }, [encryptFunc]);

    const hashAndSign = () => {                         // hash and sign message
        let hash = sha256.hmac(sessionKey, message);    // hash message with session key
        setHashValue(hash);
        console.log("privateD = " + privateD);
        console.log("bigN = " + bigN);
        let sign = encrypt(hash, privateD, bigN);       // sign hash value with user private key
        setDigitalSignature(sign);
    }

    const encryptMessage = () => {                    // encrypt message
        let block = 0;
        let splitBlock = [];
        let result = "";
        if (message.length >= 24) {                  // if message length is larger than 24, split message into 24 length block
            console.log("split")
            splitBlock = message.match(/.{1,24}/g) || [];
            console.log(splitBlock);
            block = splitBlock.length;
        } else {
            splitBlock[0] = message;
            block = 1;
        }
        for (let i = 0; i < block; i++) {           // add padding to each block
            let temp2 = "02";
            let temp = 32 - 4 - splitBlock[i].length;
            for (let i = 0; i < temp; i++) {
                temp2 = temp2 + "" + (Math.floor(Math.random() * 8) + 1);
            }
            temp2 = temp2 + "00" + splitBlock[i];
            result = result + temp2;
            console.log(temp2);
            console.log(temp2.length);
        }
        console.log(result);
        let publicKey = vefifyResult[1].split(","); // get target user public key from certificate
        console.log(publicKey);
        let addKey = result + "#%#" + sessionKey;   // combine session key to message
        console.log(addKey);
        let cipherText = encrypt(addKey, publicKey[0], publicKey[1]);   // encrypt message with target user public key
        setCipherText(cipherText);
        let temp = cipherText.join("");
        let temp2 = digitalSignature.join("");
        let temp3 = certificate.join("");
        console.log("cert = " + temp3, "state = " + certificate);
        let embedded = temp + "," + temp2 + "," + temp3;    // combine cipher text, digital signature and certificate for sending
        setEmbeddedMessage(embedded);
    }
    return (
        <div>
            <div className='ComponentTitle'>Message Enryption</div>
            <table className='dataTable2'>
                <tbody>
                    <tr>
                        <td style={{width: "15%"}}><b>Hash</b></td>
                        <td className='overCell'>{hashValue}</td>
                    </tr>
                    <tr>
                        <td colSpan="2"><b>Digital signature</b></td>
                    </tr>
                    <tr>
                        <td colSpan="2" ><div className='overCell'>{digitalSignature}</div></td>
                    </tr>
                    <tr>
                        <td colSpan="2"><b>Ciphertext</b></td>
                    </tr>
                    <tr>
                        <td colSpan="2" ><div className='overCell'>{cipherText}</div></td>
                    </tr>
                </tbody>
            </table>

        </div>

    );
}

export default MsgEncrypt;
