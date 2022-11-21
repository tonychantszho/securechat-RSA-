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
    const [hashValue, setHashValue] = useState("");
    const [digitalSignature, setDigitalSignature] = useState("");
    const [cipherText, setCipherText] = useState("");

    useEffect(() => {
        if (encryptFunc != "") {
            console.log(encryptFunc);
            if (encryptFunc == "Sign") {
                console.log("Sign");
                hashAndSign();
            } else if (encryptFunc == "encrypt") {
                console.log("encrypt");
                encryptMessage();
            }
        }
        setEncryptFunc("");
    }, [encryptFunc]);

    const hashAndSign = () => {
        let hash = sha256.hmac(sessionKey, message);
        setHashValue(hash);
        console.log("privateD = " + privateD);
        console.log("bigN = " + bigN);
        let sign = encrypt(hash, privateD, bigN);
        setDigitalSignature(sign);
    }

    const encryptMessage = () => {
        let block = 0;
        let splitBlock = [];
        let result = "";
        if (message.length >= 24) {
            console.log("split")
            splitBlock = message.match(/.{1,24}/g) || [];
            console.log(splitBlock);
            block = splitBlock.length;
        } else {
            splitBlock[0] = message;
            block = 1;
        }
        for (let i = 0; i < block; i++) {
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
        let publicKey = vefifyResult[1].split(",");
        console.log(publicKey);
        let addKey = result + "#%#" + sessionKey;
        console.log(addKey);
        let cipherText = encrypt(addKey, publicKey[0], publicKey[1]);
        setCipherText(cipherText);
        let temp = cipherText.join("");
        let temp2 = digitalSignature.join("");
        let temp3 = certificate.join("");
        console.log("cert = " + temp3, "state = " + certificate);
        let embedded = temp + "," + temp2 + "," + temp3;
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
