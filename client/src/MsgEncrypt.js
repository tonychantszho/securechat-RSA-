import { useState } from 'react';

const MsgEncrypt = ({ privateD, bigN, sha256, certificate, encrypt }) => {
    const [tempMsg, setTempMsg] = useState("");
    const [outerPublicKey, setOuterPublicKey] = useState("");
    const [hashValue, setHashValue] = useState("");
    const [digitalSignature, setDigitalSignature] = useState("");
    const [cipherText, setCipherText] = useState("");
    const [embeddedMessage, setEmbeddedMessage] = useState("");

    const hashAndSign = () => {
        let hash = sha256(tempMsg);
        setHashValue(hash);
        console.log("privateD = " + privateD);
        console.log("bigN = " + bigN);
        let sign = encrypt(hash, privateD, bigN);
        setDigitalSignature(sign);
    }

    const encryptMessage = () => {
        document.getElementById("inputMessage").value = "";
        let block = 0;
        let splitBlock = [];
        let result = "";
        if (tempMsg.length >= 24) {
            console.log("split")
            splitBlock = tempMsg.match(/.{1,24}/g) || [];
            console.log(splitBlock);
            block = splitBlock.length;
        } else {
            splitBlock[0] = tempMsg;
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
        let publicKey = outerPublicKey.split(",");
        console.log(publicKey);
        let cipherText = encrypt(result, publicKey[0], publicKey[1]);
        setCipherText(cipherText);
        let temp = cipherText.join("");
        let temp2 = digitalSignature.join("");
        let temp3 = certificate.join("");
        let embedded = temp + "," + temp2 + "," + temp3;
        setEmbeddedMessage(embedded);
    }
    return (
        <div className='divBox2'>
            <p><b>Message Enryption</b></p>
            <table id="noteTable">
                <tr>
                    <td><input
                        id="inputMessage"
                        placeholder='message to send...'
                        onChange={(event) => {
                            setTempMsg(event.target.value);
                        }}
                        style={{ width: "100%" }}
                    />
                    </td>
                    <td><button onClick={hashAndSign}>Sign</button></td>
                </tr>
                <tr>
                    <td><input
                        placeholder='public keys'
                        onChange={(event) => {
                            setOuterPublicKey(event.target.value);
                        }}
                        style={{ width: "100%" }}
                    />
                    </td>
                    <td><button onClick={encryptMessage}>encrypt</button></td>
                </tr>
            </table>
            <div><b>hash</b></div>
            <div className="cert">{hashValue}</div>
            <br />
            <div><b>digital signature</b></div>
            <div className="cert">{digitalSignature}</div>
            <br />
            <div><b>ciphertext</b></div>
            <div className="cert">{cipherText}</div>
            <br />
            <div><b>message for sending</b></div>
            <div className="cert">{embeddedMessage}</div>
        </div>
    );
}

export default MsgEncrypt;
