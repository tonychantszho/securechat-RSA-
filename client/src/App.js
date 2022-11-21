import './App.css';
import io from 'socket.io-client';
import { useState } from 'react';
import CertAuthority from './CertAuthority';
import ChatRoom from './ChatRoom';
import SelfInformation from './SelfInformation';
import MsgEncrypt from './MsgEncrypt';
import CertRelated from './CertRelated';
import MsgDecrypt from './MsgDecrypt';
const randomPrime = require('@freddyheppell/random-prime').randomPrime;
const gcd = require('compute-gcd');
const extgcd = require('extgcd');
const BigNumber = require('big-number');
const sha256 = require('js-sha256');
const URL = "http://localhost:3001";
const socket = io(URL, { autoConnect: false });

function App() {
  const [name, setName] = useState("");
  const [checkfName, setCheckfName] = useState(false);
  const [room, setRoom] = useState("1");
  const [primeNumberP, setPrimeNumberP] = useState(0);
  const [primeNumberQ, setPrimeNumberQ] = useState(0);
  const [bigN, setBigN] = useState(0);
  const [faiN, setFaiN] = useState(0);
  const [relativeE, setRelativeE] = useState(0);
  const [privateD, setPrivateD] = useState(0);
  const [sessionKey, setSessionKey] = useState(0);
  const [certificate, setCertificate] = useState("");
  const [vefifyResult, setVefifyResult] = useState(["", ""]);
  const [message, setMessage] = useState("");
  const [encryptFunc, setEncryptFunc] = useState("");
  const [embeddedMessage, setEmbeddedMessage] = useState("");


  const startConnect = () => {
    socket.connect();
  }
  const rsaAlgo = (p, q) => {
    const n = p * q;
    setBigN(n);
    let fain = (p - 1) * (q - 1);
    setFaiN(fain);
    let reE = 0;
    while (1) {
      reE = randomPrime(30);
      if (gcd(reE, fain) == 1) {
        setRelativeE(reE);
        break;
      }
    }
    let temp2 = extgcd(reE, fain);
    if (temp2.x < 0) {
      setPrivateD((fain + temp2.x));
    } else {
      setPrivateD(temp2.x);
    }
  }

  const encrypt = (data, key, modulus) => {
    let cipherText = [];
    console.log("test");
    console.log("m =" + data);

    const charCodeArr = getCharCodes(data);
    let nLength = "" + modulus;
    let maximumLength = nLength.length;

    console.log("asii =" + charCodeArr);
    for (let i = 0; i < charCodeArr.length; i++) {
      let temp = BigNumber(charCodeArr[i]).power(key).mod(modulus);
      let temp2 = "" + temp;
      while (temp2.length < maximumLength) {
        temp2 = "0" + temp2;
      }
      cipherText.push(temp2);
    }
    console.log("cipherText = " + cipherText);
    return cipherText;
  }

  const decrypt = (data, key, modulus) => {
    console.log(data);
    let plainText = [];
    let resultArray = [];
    resultArray = data.match(/.{1,4}/g) || [];
    console.log("resultArray" + resultArray);
    for (let i = 0; i < resultArray.length; i++) {
      let temp = parseInt(resultArray[i], 10);
      let temp2 = BigNumber(temp).pow(key).mod(modulus);
      plainText.push(temp2);
    }
    console.log("deasii = " + plainText);
    const charArr = charFromCodes(plainText);
    let result = charArr.join("");
    //let result = temp.split(":");
    console.log("charArr = " + result);
    return result;
  }

  const getCharCodes = (c) => {
    let charCodeArray = [];
    for (let x = 0; x < c.length; x++) {
      let code = c.charCodeAt(x);
      charCodeArray.push(code);
    }
    return charCodeArray;
  }

  const charFromCodes = (c) => {
    let charArray = [];
    for (let x = 0; x < c.length; x++) {
      let code = String.fromCharCode(c[x]);
      charArray.push(code);
    }
    return charArray;
  }

  const genPrimeNumber = () => {
    let p = randomPrime(32, 60);
    let q = randomPrime(32, 60);
    while (p == q) {
      q = randomPrime(32, 60);
    }
    setPrimeNumberP(p);
    setPrimeNumberQ(q);
    rsaAlgo(p, q);
  };

  const checkName = () => {
    if (name != "") {
      setCheckfName(true);
    }
    if (name == "CA") {
      setRoom("CA");
    }
  };

  if (checkfName == false) {
    return (
      <div className="App">
        <h1>Enter your name</h1>
        <input type="text" onChange={(e) => setName(e.target.value)} />
        <button onClick={checkName}>Start</button>
      </div>
    );
  } else if (name == "CA") {
    return (
      <CertAuthority
        genPrimeNumber={genPrimeNumber}
        room={room}
        p={primeNumberP}
        q={primeNumberQ}
        bigN={bigN}
        relativeE={relativeE}
        privateD={privateD}
        encrypt={encrypt}
        decrypt={decrypt}
      />
    );
  } else {
    startConnect();
    return (
      <div className="App">
        <div id="topBar">
          RSA Encryption & Authentication
        </div>
        <div className="container">
          <div>
            <SelfInformation
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
            <ChatRoom
              name={name}
              socket={socket}
              room={room}
              setRoom={setRoom}
              setMessage={setMessage}
              message={message}
              setEncryptFunc={setEncryptFunc}
              embeddedMessage={embeddedMessage}
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
}
export default App;