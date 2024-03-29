import { useEffect } from 'react';
const KeyGenerate = ({
    genPrimeNumber,
    setSessionKey,
    primeNumberP,
    primeNumberQ,
    bigN,
    faiN,
    relativeE,
    privateD,
    sessionKey,
    certificate,
    embeddedMessage
}) => {
    useEffect(() => {
        if (embeddedMessage == "" && faiN != 0) {   //regenerate session key when embeddedMessage was sent
            genSessionKey();
        }
    }, [embeddedMessage]);

    const genSessionKey = () => {                   //generate session key
        let sessionKey = "";
        for (let i = 0; i < 6; i++) {               //generate 6 random number as session key
            let temp = Math.floor(Math.random() * 10);
            sessionKey = sessionKey + temp;
        }
        setSessionKey(sessionKey);
    }
    return (
        <div>
            <div className='ComponentTitle'>Key Generation</div>
            <table className="dataTable1">
                <tbody>
                    <tr>
                        <td colSpan="4"><b>Random pick p and q:</b></td>
                        <td colSpan="2" style={{ textAlign: "center" }}><button onClick={genPrimeNumber}>generate</button></td>
                    </tr>
                </tbody>
                <tbody>
                    <tr>
                        <td colSpan="6" style={{ whiteSpace: "pre", wordBreak: "break-all" }}>
                            <b>p=</b>{primeNumberP}   <b>q=</b>{primeNumberQ}   <b>N=</b>{bigN}   <b>φ(N)=</b>{faiN}   <b>e=</b>{relativeE}   <b>d=</b>{privateD}
                        </td>
                    </tr>
                </tbody>
                <tbody>
                    <tr>
                        <td colSpan="3"><b>Public key:</b> &#123;{relativeE},{bigN}&#125;</td>
                        <td colSpan="3"><b>Private key:</b> &#123;{privateD},{bigN}&#125;</td>
                    </tr>
                </tbody>
                <tbody>
                    <tr>
                        <td colSpan="6"><hr /></td>
                    </tr>
                </tbody>
                <tbody>
                    <tr>
                        <td colSpan="3"><b>One-time session key:</b></td>
                        <td>{sessionKey}</td>
                        <td colSpan="2" style={{ textAlign: "center" }}><button onClick={genSessionKey}>generate</button></td>
                    </tr>
                </tbody>
                <tbody>
                    <tr>
                        <td colSpan="2" ><b>Certificate:</b></td>
                        <td colSpan="4" className="overCell">{certificate}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default KeyGenerate;
