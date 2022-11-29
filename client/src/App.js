import './App.css';
import { useState } from 'react';
import io from 'socket.io-client';                                      //simulate chatroom
import CertAuthority from './Cert Authority/CertAuthority';
import ChatArea from './Chat Room/chat components/ChatArea';
import KeyGenerate from './Chat Room/chat components/KeyGenerate';
import MsgEncrypt from './Chat Room/chat components/MsgEncrypt';
import CertRelated from './Chat Room/chat components/CertRelated';
import MsgDecrypt from './Chat Room/chat components/MsgDecrypt';
const randomPrime = require('@freddyheppell/random-prime').randomPrime; //generate prime number randomly
const gcd = require('compute-gcd');                                     //used to check e is relative prime to faiN
const extgcd = require('extgcd');                                       //used to calculate extended euclidean algorithm
const BigNumber = require('big-number');                                //used to calculate power and mod
const sha256 = require('js-sha256');                                    //used to hash the message with session key
const URL = "http://localhost:3001";                                    //server url
const socket = io(URL);                                                 //socket.io client

function App() {                                                        //main function
  const [name, setName] = useState("");                                 //user name
  const [checkfName, setCheckfName] = useState(false);                  //check if user name is valid
  const [room, setRoom] = useState("No connection");                    //room name
  const [primeNumberP, setPrimeNumberP] = useState(0);                  //prime number p
  const [primeNumberQ, setPrimeNumberQ] = useState(0);                  //prime number q
  const [bigN, setBigN] = useState(0);                                  //N
  const [faiN, setFaiN] = useState(0);                                  //fai N
  const [relativeE, setRelativeE] = useState(0);                        //e
  const [privateD, setPrivateD] = useState(0);                          //d
  const [sessionKey, setSessionKey] = useState(0);                      //session key for hash
  const [certificate, setCertificate] = useState("");                   //certificate afte signing by CA
  const [vefifyResult, setVefifyResult] = useState(["", ""]);           //reslut of verify certificate
  const [message, setMessage] = useState("");                           //message want to send
  const [encryptFunc, setEncryptFunc] = useState("");                   //encrypt function, sign || encrypt message
  const [embeddedMessage, setEmbeddedMessage] = useState("");           //message for sending

  const startConnect = () => {          //connect to server
    socket.connect();
  }
  const rsaAlgorithm = (p, q) => {      //calculate RSA algorithm
    const n = p * q;                    //calculate big N, N = p*q
    setBigN(n);
    let fain = (p - 1) * (q - 1);       //calculate fai N, faiN = (p-1)*(q-1)
    setFaiN(fain);
    let reE = 0;
    while (1) {                         //generate e,until e is relative prime to faiN
      reE = randomPrime(30);
      if (gcd(reE, fain) == 1) {
        setRelativeE(reE);
        break;
      }
    }
    let temp2 = extgcd(reE, fain);      //calculate d using extended euclidean algorithm
    if (temp2.x < 0) {
      setPrivateD((fain + temp2.x));
    } else {
      setPrivateD(temp2.x);
    }
  }

  const encrypt = (data, key, modulus) => { // encrypt function,data = message to encrypt, key = e or d, modulus = N(bigN)
    let cipherText = [];
    console.log("m =" + data);
    const asciiCodeArray = getAsciiCodes(data); //convert message to ascii code
    let nLength = "" + modulus;             //get length of modulus(N)
    let maximumLength = nLength.length;     //same
    console.log("asii =" + asciiCodeArray);
    for (let i = 0; i < asciiCodeArray.length; i++) {  //encrypt each ascii code to c one by one using RSA algorithm
      let temp = BigNumber(asciiCodeArray[i]).power(key).mod(modulus);  //c = m^key(e or d) mod modulus(N)
      let temp2 = "" + temp;
      while (temp2.length < maximumLength) {        //if length of c is less than length of N, add 0 in front of c
        temp2 = "0" + temp2;
      }
      cipherText.push(temp2);                       //add c to cipherText array
    }
    console.log("cipherText = " + cipherText);
    return cipherText;                              //return encrypted messgae(cipherText array)
  }

  const decrypt = (data, key, modulus) => { // decrypt function,data = message to decrypt, key = e or d, modulus = N(bigN)
    console.log(data);
    let plainText = [];
    let resultArray = [];
    resultArray = data.match(/.{1,4}/g) || [];      //split message to array, each element is 4 digit since length of N must be 4 digit in this system
    console.log("resultArray" + resultArray);
    for (let i = 0; i < resultArray.length; i++) {  //decrypt each c to ascii code one by one using RSA algorithm
      let temp = parseInt(resultArray[i], 10);
      let temp2 = BigNumber(temp).pow(key).mod(modulus);  //m(ascii code) = c^key(e or d) mod modulus(N)
      plainText.push(temp2);                        //add m to plainText array
    }
    console.log("deasii = " + plainText);
    const stringM = mFromAscii(plainText);          //convert ascii code to m(plaintext)
    let result = stringM.join("");                  //join all m to one string
    console.log("charArr = " + result);
    return result;                                  //return decrypted message
  }

  const getAsciiCodes = (m) => {                    //function for convert message to ascii code
    let asciiCodeArray = [];
    for (let x = 0; x < m.length; x++) {            //convert each character to ascii code
      let ascii = m.charCodeAt(x);
      asciiCodeArray.push(ascii);
    }
    return asciiCodeArray;
  }

  const mFromAscii = (c) => {                      //function for convert ascii code to message
    let msgArray = [];
    for (let x = 0; x < c.length; x++) {           //convert each ascii code to character
      let msg = String.fromCharCode(c[x]);
      msgArray.push(msg);
    }
    return msgArray;
  }

  const genPrimeNumber = () => {                 //function for generate prime number
    let p = randomPrime(32, 60);                 //generate prime number p within range 32-60
    let q = randomPrime(32, 60);                 //generate prime number q within range 32-60
    while (p == q) {                             //if p = q, generate q again
      q = randomPrime(32, 60);
    }
    setPrimeNumberP(p);
    setPrimeNumberQ(q);
    rsaAlgorithm(p, q);                          //calculate n, faiN, e, d
  };

  const checkName = () => {                      //function for check name
    if (name != "") {                            //if name is not empty, redirect to chat room page
      setCheckfName(true);
    }
    if (name == "CA") {                          //if name is CA, redirect to CA page
      setRoom("CA");
    }
  };

  if (checkfName == false) {                    //if name is empty, request user to enter name
    return (
      <div className="certInfo">
        <h1>Enter your name</h1>
        <input type="text" onChange={(e) => setName(e.target.value)} />
        <br />
        <button onClick={checkName}>Start</button>
      </div>
    );
  } else if (name == "CA") {                    //if name is CA, redirect to CA page
    return (
      <CertAuthority
        genPrimeNumber={genPrimeNumber}
        p={primeNumberP}
        q={primeNumberQ}
        bigN={bigN}
        relativeE={relativeE}
        privateD={privateD}
        encrypt={encrypt}
        decrypt={decrypt}
      />
    );
  } else {                                    //if name is not empty and not equal to "CA", redirect to chat room page
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
}
export default App;