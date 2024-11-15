import { useNavigate } from "react-router-dom";

const Entry = () => {
    const Navigate = useNavigate();
    const gotoLogin = () => {
        Navigate("/login")
    }
    const gotoSignup = () => {
    Navigate("/signup")
    }
    return (

            <div className="entry">
                <h1>CITI-FIX-IT-FELIX</h1>
                <div className="userbuttons">
                    <button onClick={gotoLogin}>LOGIN</button>
                    <button onClick={gotoSignup}>SIGN UP</button>
                </div>
            </div>

    )
}

export default Entry;