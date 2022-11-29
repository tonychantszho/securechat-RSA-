import { useEffect } from 'react';
import io from 'socket.io-client';
const URL = "http://localhost:3001";
const socket = io(URL, { autoConnect: false });

const CertAuthority = (props) => {
  socket.connect();
  socket.emit("join_room", "CA");       // join CA room
  let init = false;
  useEffect(() => {
    if (!init) {
      socket.on("cert_generate", (data, socketId) => {   // receive request from client to generate certificate
        console.log("d = " + props.privateD + " n = " + props.bigN);
        let encryptedCert = props.encrypt(data, props.privateD, props.bigN);  // encrypt certificate using private key
        console.log("id = " + socketId);
        socket.emit("enc_cert", { encryptedCert, socketId }); // send certificate to client
      });

      socket.on("cert_varify", (data, socketId) => {    // receive request from client to varify certificate
        console.log("e = " + props.relativeE + " n = " + props.bigN);
        let decryptedCert = props.decrypt(data, props.relativeE, props.bigN); // decrypt certificate using public key
        let cert = decryptedCert.split(":");
        if (cert.length <= 1) {     // if certificate is not valid

          console.log(cert);
          cert = ["failed", ""];
        } else {
          let tempCert = cert[1].split(",");
          console.log(cert);
          if (isNaN(tempCert[0]) || isNaN(tempCert[1])) {
            cert = ["failed", ""];
          }
        }
        console.log(cert);
        socket.emit("varify_result", { cert, socketId });     // send result to client
      });
      init = true;
    }

    return () => {
      socket.off("cert_generate");
      socket.off("cert_varify");
    }

  }, [props.bigN, props.relativeE]);
  return (

    <div className="certInfo">
      <h1>Certificate Authority</h1>
      <button onClick={props.genPrimeNumber}>Generate</button>
      <table>
        <tbody>
          <tr>
            <td>p</td>
            <td>{props.p}</td>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <td>q</td>
            <td>{props.q}</td>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <td>bigN</td>
            <td>{props.bigN}</td>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <td>e</td>
            <td>{props.relativeE}</td>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <td><b>public key</b></td>
            <td>&#123;{props.relativeE}, {props.bigN}&#125; </td>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <td><b>private key</b></td>
            <td>&#123;{props.privateD}, {props.bigN}&#125;</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default CertAuthority;
