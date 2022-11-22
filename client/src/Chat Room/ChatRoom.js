import { useEffect, useState } from 'react';
import ChatArea from '../chat components/ChatArea';
import KeyGenerate from '../chat components/KeyGenerate';
import MsgEncrypt from '../chat components/MsgEncrypt';
import CertRelated from '../chat components/CertRelated';
import MsgDecrypt from '../chat components/MsgDecrypt';

function ChatRoom({ name, genPrimeNumber, primeNumberP, primeNumberQ, faiN, bigN, relativeE, privateD, encrypt, decrypt, socket, sha256 }) {
  const [room, setRoom] = useState("No connection");
  const [sessionKey, setSessionKey] = useState(0);
  const [certificate, setCertificate] = useState("");
  const [vefifyResult, setVefifyResult] = useState(["", ""]);
  const [message, setMessage] = useState("");
  const [encryptFunc, setEncryptFunc] = useState("");
  const [embeddedMessage, setEmbeddedMessage] = useState("");

  return (
    <div className="App">
      <div id="topBar">
        <div>
          RSA Encryption & Authentication
        </div>
        <div style={{ fontSize: 18 }} id="topBar">
          Welcome {name} !
        </div>
      </div>

      <div className="container">
        <div>
          <KeyGenerate
            genPrimeNumber={genPrimeNumber}
            setSessionKey={setSessionKey}
            primeNumberP={primeNumberP}
            primeNumberQ={primeNumberQ}
            bigN={bigN}
            faiN={faiN}
            relativeE={relativeE}
            privateD={privateD}
            sessionKey={sessionKey}
            certificate={certificate}
            embeddedMessage={embeddedMessage}
          />

          <div>
            <MsgEncrypt
              privateD={privateD}
              bigN={bigN}
              sha256={sha256}
              certificate={certificate}
              sessionKey={sessionKey}
              encrypt={encrypt}
              setMessage={setMessage}
              message={message}
              encryptFunc={encryptFunc}
              setEncryptFunc={setEncryptFunc}
              vefifyResult={vefifyResult}
              setEmbeddedMessage={setEmbeddedMessage}
            />
          </div>
        </div>
        <div>
          <ChatArea
            name={name}
            socket={socket}
            room={room}
            setRoom={setRoom}
            setMessage={setMessage}
            message={message}
            setEncryptFunc={setEncryptFunc}
            embeddedMessage={embeddedMessage}
            setEmbeddedMessage={setEmbeddedMessage}
          />
        </div>
        <div>
          <CertRelated
            name={name}
            relativeE={relativeE}
            bigN={bigN}
            vefifyResult={vefifyResult}
            socket={socket}
            setCertificate={setCertificate}
            setVefifyResult={setVefifyResult}
          />
          <div>
            <MsgDecrypt
              socket={socket}
              decrypt={decrypt}
              privateD={privateD}
              bigN={bigN}
              sha256={sha256}
              vefifyResult={vefifyResult}
            />
          </div>
        </div>
      </div>
    </div >
  );
}
export default ChatRoom;