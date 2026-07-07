import "./Header.css";
import { usePlayer } from "../../context/PlayerContext";
import { useState, useEffect } from "react";
import DepositModal from "../DepositModal/DepositModal";
import { useSound } from "../../context/SoundContext";
import { useAuth } from "../../hooks/useAuth";
import { signIn, signUp, signOut } from "../../lib/auth";


function Header() {


    const [open, setOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const { user } = useAuth();


    // MODALS
    const [showAbout, setShowAbout] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [showWithdraw, setShowWithdraw] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState("");
const [withdrawPhone, setWithdrawPhone] = useState("");
    const [showLogin, setShowLogin] = useState(false);



    // AUTH STATES
    const [isSignup, setIsSignup] = useState(false);
const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const [loading, setLoading] = useState(false);



    const { balance, setBalance } = usePlayer();
    const { soundOn, toggleSound } = useSound();




    // ESC CLOSE
    useEffect(() => {

        const close = (e) => {

            if (e.key === "Escape") {

                setMenuOpen(false);
                setShowLogin(false);

            }

        };


        window.addEventListener("keydown", close);


        return () => 
            window.removeEventListener("keydown", close);


    }, []);





    // OPEN LOGIN
    function openAuth(){

        setShowLogin(true);
        setMenuOpen(false);
        setLoginError("");

    }





    // REAL LOGIN
 async function login(){

    if(!phone || !password){

        setLoginError("Enter phone number and password");
        return;

    }


    setLoading(true);
    setLoginError("");


    try{

        await signIn(phone,password);

        alert("Login successful");

        setPhone("");
        setPassword("");
        setShowLogin(false);


    }catch(error){

        setLoginError(error.message);

    }


    setLoading(false);

}






    // REAL SIGNUP
async function signup(){

    if(!phone || !password){

        setLoginError("Enter phone number and password");
        return;

    }


    setLoading(true);
    setLoginError("");



    try{


        await signUp(phone,password);


        alert(
            "Account created successfully. You can now login."
        );


        setIsSignup(false);
        setPhone("");
        setPassword("");



    }catch(error){


        setLoginError(error.message);


    }


    setLoading(false);


}






    // DEPOSIT ACCESS CHECK
function openDeposit(){

    setOpen(true);

}






    // LOGOUT

    async function logout(){


        try{


            await signOut();


            setBalance(0);


            alert("Logged out successfully");


            setMenuOpen(false);



        }catch(error){


            alert(error.message);


        }


    }






    return (
        <>

            <header className="header">


                <div className="logo">

                    <img src="/logo.png" alt="logo" />

                </div>





                <button 
                    className="deposit-btn"
                    onClick={openDeposit}
                >

                    <span className="plus">
                        +
                    </span>

                    Deposit

                </button>





                <div className="header-right">


                    <button 
                        className="sound-btn"
                        onClick={toggleSound}
                    >

                        {soundOn ? "🔊" : "🔇"}

                    </button>





                    <div className="wallet">


                        <span className="balance-value">

                            {balance.toFixed(2)}

                        </span>



                        <span className="balance-currency">

                            KES

                        </span>


                    </div>





                    <button
                        className="menu-btn"
                        onClick={() => setMenuOpen(true)}
                    >

                        ☰

                    </button>



                </div>


            </header>





            {open && (

                <DepositModal 
                    onClose={() => setOpen(false)}
                />

            )}






            <div
                className={`menu-overlay ${menuOpen ? "show" : ""}`}
                onClick={() => setMenuOpen(false)}
            />
            
            {/* DRAWER */}

            <div className={`side-drawer ${menuOpen ? "open" : ""}`}>


                <div className="drawer-header">

                    <div className="avatar">
                        👤
                    </div>


                    <div>

                        <h4>
                            {user ? user.phone : "Guest User"}
                        </h4>


                        <p>
                            {user ? "Logged in" : "+2547******"}
                        </p>


                    </div>


                </div>





                {/* ACCOUNT */}

                <div className="drawer-section">

                    <p className="section-title">
                        ACCOUNT
                    </p>


                    <button
                        className="drawer-item"
                        onClick={openAuth}
                    >

                        {user ? "Profile" : "Login / Sign Up"}

                    </button>


                </div>






                {/* FINANCE */}

                <div className="drawer-section">


                    <p className="section-title">
                        FINANCE
                    </p>



                    <button
                        className="drawer-item"
                        onClick={() => {

                            setShowWithdraw(true);
                            setMenuOpen(false);

                        }}
                    >

                        Withdraw

                    </button>





                    <button
                        className="drawer-item highlight"
                        onClick={openDeposit}
                    >

                        Deposit

                    </button>


                </div>








                {/* INFO */}

                <div className="drawer-section">


                    <p className="section-title">
                        INFO
                    </p>


<button

                        className="drawer-item"

                        onClick={() => {



                            setShowAbout(true);

                            setMenuOpen(false);



                        }}

                    >



                        About Us



                    </button>




                    <button
                        className="drawer-item"
                        onClick={() => {

                            setShowTerms(true);
                            setMenuOpen(false);

                        }}
                    >

                        Terms

                    </button>






                    {user && (

                        <button
                            className="drawer-item danger"
                            onClick={logout}
                        >

                            LOGOUT

                        </button>

                    )}



                </div>


            </div>








            {/* ABOUT MODAL */}

           {showAbout && (

<div className="simple-modal">

    <div className="modal-box info-modal">

        <h3>
            About Us
        </h3>


        <p>
            Welcome to our crash gaming platform. We provide a fast,
            transparent and interactive betting experience where players
            predict how high the multiplier will rise before the plane
            crashes.
        </p>


        <p>
            Each round starts with a countdown. Players place bets before
            takeoff and can cash out anytime while the multiplier is
            increasing.
        </p>


        <h4>
            How Betting Works
        </h4>


        <ul>

            <li>
                Place your bet before the round starts.
            </li>

            <li>
                The multiplier increases during flight.
            </li>

            <li>
                Cash out before the crash to secure winnings.
            </li>

            <li>
                If the plane crashes before cash out, the bet is lost.
            </li>

        </ul>


        <button 
            onClick={() => setShowAbout(false)}
        >
            Close
        </button>


    </div>

</div>

)}








            {/* TERMS MODAL */}

            {showTerms && (

<div className="simple-modal">


<div className="modal-box info-modal">


<h3>
Terms & Conditions
</h3>


<p>
By using this platform, you agree to these terms and understand
that crash games involve risk.
</p>


<h4>
Betting Rules
</h4>


<ul>

<li>
All bets must be placed before the flight begins.
</li>


<li>
Players are responsible for choosing when to cash out.
</li>


<li>
No refunds are provided after a completed round.
</li>


<li>
Multiplier results are generated automatically by the game system.
</li>


<li>
Users must ensure their account balance is sufficient before betting.
</li>

</ul>


<h4>
Responsible Gaming
</h4>


<p>
Only play with amounts you can afford to lose.
</p>



<button
onClick={() => setShowTerms(false)}
>

Close

</button>


</div>


</div>

)}








            {showWithdraw && (

<div className="simple-modal">

    <div className="modal-box info-modal">


        <h3>
            Withdraw Funds
        </h3>


        <div className="withdraw-info">

            <p>
                Account:
            </p>

            <strong>
                {user ? user.phone : "Guest"}
            </strong>


        </div>



        <div className="withdraw-info">

            <p>
                Available Balance:
            </p>


            <strong>
                {balance.toFixed(2)} KES
            </strong>


        </div>




        <input

            type="number"

            placeholder="Withdrawal amount"

            value={withdrawAmount}

            onChange={(e)=>setWithdrawAmount(e.target.value)}

        />




        <input

            type="tel"

            placeholder="M-Pesa number (07xxxxxxxx)"

            value={withdrawPhone}

            onChange={(e)=>setWithdrawPhone(e.target.value)}

        />





        <button

        onClick={()=>{


            if(!withdrawAmount){

                alert("Enter withdrawal amount");
                return;

            }


            if(Number(withdrawAmount) > balance){

                alert("Insufficient balance");
                return;

            }


            alert(
                "Withdrawal request submitted"
            );


            setWithdrawAmount("");
            setWithdrawPhone("");

        }}

        >

            Request Withdrawal

        </button>





        <button

        onClick={()=>setShowWithdraw(false)}

        >

            Close

        </button>



    </div>

</div>

)}









            {/* LOGIN / SIGNUP MODAL */}

            {showLogin && (

                <div className="simple-modal">


                    <div className="modal-box">


                        <h3>
                            {isSignup ? "Create Account" : "Login"}
                        </h3>


<input
    type="tel"
    placeholder="Phone number (07xxxxxxxx)"
    value={phone}
    onChange={(e)=>setPhone(e.target.value)}
/>





                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                        />






                        {loginError && (

                            <p style={{color:"red"}}>

                                {loginError}

                            </p>

                        )}






                        <button
                            onClick={isSignup ? signup : login}
                            disabled={loading}
                        >

                            {
                                loading
                                ? "Please wait..."
                                : isSignup
                                ? "Create Account"
                                : "Login"
                            }


                        </button>







                        <button
                            onClick={() => {

                                setIsSignup(!isSignup);
                                setLoginError("");

                            }}
                        >

                            {
                                isSignup
                                ? "Already have account? Login"
                                : "Create new account"
                            }


                        </button>







                        <button
                            onClick={() => {

                                setShowLogin(false);
                                setLoginError("");

                            }}
                        >

                            Close

                        </button>



                    </div>


                </div>

            )}







        </>

    );

}



export default Header;