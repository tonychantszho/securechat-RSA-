const SelfInformation = ({
    genPrimeNumber,
    primeNumberP,
    primeNumberQ,
    bigN,
    faiN,
    relativeE,
    privateD,
    certificate
}) => {

    return (
        <div className='divBox'>
            <table id="noteTable">
                <tr>
                    <td>random pick p and q</td>
                    <td><button onClick={genPrimeNumber}>generate</button></td>
                </tr>
                <tr>
                    <td>p</td>
                    <td>{primeNumberP}</td>
                </tr>
                <tr>
                    <td>q</td>
                    <td>{primeNumberQ}</td>
                </tr>
                <tr>
                    <td>N</td>
                    <td>{bigN} </td>
                </tr>
                <tr>
                    <td>φ(N)</td>
                    <td>{faiN} </td>
                </tr>
                <tr>
                    <td>e</td>
                    <td>{relativeE} </td>
                </tr>
                <tr>
                    <td>d</td>
                    <td>{privateD} </td>
                </tr>
                <tr>
                    <td><b>public key</b></td>
                    <td>&#123;{relativeE},{bigN}&#125; </td>
                </tr>
                <tr>
                    <td><b>private key</b></td>
                    <td>&#123;{privateD},{bigN}&#125;</td>
                </tr>
            </table>
            <div><b>Certificate</b></div>
            <div class="cert">{certificate}</div>
        </div>
    );
}

export default SelfInformation;
