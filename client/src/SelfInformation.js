const SelfInformation = ({
    genPrimeNumber,
    setSessionKey,
    primeNumberP,
    primeNumberQ,
    bigN,
    faiN,
    relativeE,
    privateD,
    sessionKey,
    certificate
}) => {
    const genSessionKey = () => {
        let sessionKey = "";
        for (let i = 0; i < 6; i++) {
            let temp = Math.floor(Math.random() * 10);
            sessionKey = sessionKey + temp;
        }
        setSessionKey(sessionKey);
    }
    return (
        <div>
            <div className='ComponentTitle'>Key Geneeration</div>
            <div>
                <b>random pick p and q:</b>
                <button onClick={genPrimeNumber}>generate</button>
            </div>
            <table id="noteTable">
                <tr>
                    <td>p</td>
                    <td>{primeNumberP}</td>
                    <td>q</td>
                    <td>{primeNumberQ}</td>
                </tr>
                <tr>
                    <td>N</td>
                    <td>{bigN} </td>
                    <td>φ(N)</td>
                    <td>{faiN} </td>
                </tr>
                <tr>
                    <td>e</td>
                    <td>{relativeE} </td>
                    <td>d</td>
                    <td>{privateD} </td>
                </tr>
            </table>
            <div><b>public key:</b> &#123;{relativeE},{bigN}&#125;, <b>private key:</b> &#123;{privateD},{bigN}&#125;</div>
            <div><b>Certificate</b></div>
            <div class="cert">{certificate}</div>
            <div>
                <b>one-time session key:</b>
                <button onClick={genSessionKey}>generate</button>
            </div>
            <div>{sessionKey}</div>
        </div>
    );
}

export default SelfInformation;
