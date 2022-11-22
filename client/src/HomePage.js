import './App.css';
import io from 'socket.io-client';
import { useState } from 'react';
import CertAuthority from './Cert Authority/CertAuthority';
import ChatRoom from './Chat Room/ChatRoom';
const randomPrime = require('@freddyheppell/random-prime').randomPrime;
const gcd = require('compute-gcd');
const extgcd = require('extgcd');
const BigNumber = require('big-number');
const sha256 = require('js-sha256');
const URL = "http://localhost:3001";
const socket = io(URL, { autoConnect: false });

function HomePage() {
  const [name, setName] = useState("");
  const [checkfName, setCheckfName] = useState(false);
  const [room, setRoom] = useState("No connection");
  const [primeNumberP, setPrimeNumberP] = useState(0);
  const [primeNumberQ, setPrimeNumberQ] = useState(0);
  const [bigN, setBigN] = useState(0);
  const [faiN, setFaiN] = useState(0);
  const [relativeE, setRelativeE] = useState(0);
  const [privateD, setPrivateD] = useState(0);

  const startConnect = () => {
    socket.connect();
  }
  const rsaAlgorithm = (p, q) => {
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
    rsaAlgorithm(p, q);
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
      <div className="certInfo">
        <h1>Enter your name</h1>
        <input type="text" onChange={(e) => setName(e.target.value)} />
        <br />
        <button onClick={checkName}>Start</button>
      </div>
    );
  } else if (name == "CA") {
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
  } else {
    startConnect();
    return (
      <ChatRoom
        name={name}
        genPrimeNumber={genPrimeNumber}
        primeNumberP={primeNumberP}
        primeNumberQ={primeNumberQ}
        faiN={faiN}
        bigN={bigN}
        relativeE={relativeE}
        privateD={privateD}
        encrypt={encrypt}
        decrypt={decrypt}
        socket={socket}
        sha256={sha256}
      />
    );
  }
}
export default HomePage;