import { useState, useRef, useEffect } from "react";
import "./DepositModal.css";
import { signUp, signIn, getUser } from "../../lib/auth";


const MPESA_BASE = "https://starlink-backend-yb3n.onrender.com";


function DepositModal({ onClose, onDepositSuccess }) {

    const [phone, setPhone] = useState("254");
    const [amount, setAmount] = useState("");



    const [showAuth, setShowAuth] = useState(false);


    const [registered, setRegistered] = useState(false);


    const [loginMode, setLoginMode] = useState(false);



    const [name, setName] = useState("");


    const [password, setPassword] = useState("");



    const [loading, setLoading] = useState(false);


    const [status, setStatus] = useState("");



    const MIN = 500;




    // LOCKS
    const lockRef = useRef(false);



    // TRANSACTION ID
    const localIdRef = useRef(null);



    // POLLING
    const pollRef = useRef(null);






    // CHECK EXISTING LOGIN

    useEffect(() => {


        const user = getUser();


        if(user){


            setRegistered(true);

            setName(user.phone);


        }


    }, []);








    // PHONE NORMALIZER

    function normalizePhone(p) {


        let phone = p.trim().replace(/\D/g, "");



        if (phone.startsWith("07")) 
            return "254" + phone.slice(1);



        if (phone.startsWith("01")) 
            return "254" + phone.slice(1);



        if (phone.startsWith("254")) 
            return phone;



        return null;

    }







    function selectAmount(val) {

        setAmount(val);

    }







    function openAuth() {


        if (!phone || !amount) {

            alert("Enter phone and amount");
            return;

        }



        if (Number(amount) < MIN) {

            alert("Minimum deposit is 500 KES");
            return;

        }



        setShowAuth(true);


    }









    // CREATE ACCOUNT / LOGIN

    async function handleAuth(){


        const normalized = normalizePhone(phone);



        if(!normalized){


            alert("Invalid phone number");

            return;

        }




        if(!password){


            alert("Enter password");

            return;

        }





        try{



            if(loginMode){


                await signIn(
                    normalized,
                    password
                );


                alert("Login successful ✅");



            }else{


                await signUp(
                    normalized,
                    password
                );


                alert(
                    "Account created successfully 🎉"
                );


            }





            setRegistered(true);

            setName(normalized);


            setPassword("");

            setShowAuth(false);




        }catch(error){



            alert(error.message);



        }


    }







    // =========================
    // STK PAYMENT
    // =========================

    async function payNow() {


        if (lockRef.current) return;


        lockRef.current = true;



        const normalized = normalizePhone(phone);



        if (!normalized) {


            alert("Invalid phone number");

            lockRef.current = false;

            return;

        }





        if (Number(amount) < MIN) {


            alert("Minimum deposit is 500 KES");


            lockRef.current = false;


            return;

        }



        try {


            setLoading(true);


            setStatus("Sending STK push...");





            if (!localIdRef.current) {


                localIdRef.current =
                    `DEP-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;


            }






            const res = await fetch(
                `${MPESA_BASE}/api/runPrompt`,
                {

                    method:"POST",

                    headers:{
                        "Content-Type":"application/json"
                    },


                    body:JSON.stringify({

                        phone:normalized,

                        amount:Number(amount),

                        local_id:localIdRef.current,

                        transaction_desc:"Aviator Deposit",

                        till_id:"1"

                    })

                }
            );





            const data = await res.json();



            console.log(
                "STK RESPONSE:",
                data
            );





            if(!res.ok || data.status === false){


                setStatus("STK failed ❌");


                
                return;


            }





            setStatus(
                "STK sent 📲 check your phone"
            );




            const checkoutId =
                data.checkout_request_id ||
                data.checkoutRequestId ||
                data.id ||
                null;

                
            // =========================
            // POLLING PAYMENT STATUS
            // =========================

            if (checkoutId) {


                pollRef.current = setInterval(async () => {


                    try {


                        const r = await fetch(
                            `${MPESA_BASE}/api/status/${checkoutId}`
                        );


                        const d = await r.json();



                       if (
    d?.success === true &&
    (
        d?.status === "completed" ||
        d?.payment_status === "SUCCESS" ||
        d?.ResultCode === 0
    )
){


                            clearInterval(
                                pollRef.current
                            );


                            setStatus(
                                "Payment successful ✅"
                            );


                            setLoading(false);


                            lockRef.current = false;



                            onDepositSuccess(amount);

alert(
    "DEPOSIT SUCCESSFUL 🎉"
);


                        }



                    } catch(err) {


                        console.log(
                            "poll error",
                            err
                        );


                    }



                },4000);


            }




        } catch(err){


            console.log(err);


            setStatus(
                "Network error ❌"
            );


        }



        setLoading(false);

        lockRef.current=false;


    }







    // CLEANUP

    useEffect(()=>{


        return ()=>{


            clearInterval(
                pollRef.current
            );


        };


    },[]);







    return (

        <div className="deposit-overlay">





            {/* HEADER */}

            <div className="deposit-header">


                <h2>
                    Deposit
                </h2>


                <button onClick={onClose}>
                    ✕
                </button>


            </div>







            {/* CARD */}

            <div className="deposit-card small">





                {registered && (

                    <div className="account-bar">

                        👤 Account:
                        <b>
                            {name}
                        </b>

                    </div>

                )}







                <p className="subtext">

                    Minimum deposit is
                    <b>
                        500 KES
                    </b>

                </p>







                {/* PHONE */}

                <label>
                    M-Pesa Number
                </label>


                <input

                    value={phone}

                    onChange={(e)=>
                        setPhone(e.target.value)
                    }

                    placeholder="07XXXXXXXX / 2547XXXXXXXX"

                />







                {/* QUICK AMOUNTS */}

                <div className="amount-grid">


                    {[500,750,1000,2000].map(v=>(

                        <button

                            key={v}

                            className={
                                `amt-btn ${
                                Number(amount)===v
                                ?"active"
                                :""
                                }`
                            }

                            onClick={()=>
                                selectAmount(v)
                            }

                        >

                            {v}

                        </button>


                    ))}


                </div>







                {/* CUSTOM AMOUNT */}

                <input

                    className="amount-input"

                    value={amount}

                    onChange={(e)=>
                        setAmount(e.target.value)
                    }

                    placeholder="Or enter custom amount"

                />








                {loading && (

                    <div
                        style={{
                            fontSize:12,
                            color:"#1a7a3a",
                            marginTop:8
                        }}
                    >

                        {status}

                    </div>

                )}







                {!registered ? (


                    <button

                        className="deposit-btn-main"

                        onClick={openAuth}

                    >

                        Continue

                    </button>



                ):(



                    <button

                        className="deposit-btn-main"

                        onClick={payNow}

                        disabled={loading}

                    >


                        {
                            loading
                            ?"Processing..."
                            :"Pay via STK Push"
                        }


                    </button>


                )}





            </div>









            {/* AUTH MODAL */}

            {showAuth && (


                <div className="auth-modal">


                    <div className="auth-box">



                        <h3>

                            {
                                loginMode
                                ?"Login"
                                :"Create Account"
                            }


                        </h3>







                        <input

                            value={phone}

                            onChange={(e)=>
                                setPhone(e.target.value)
                            }

                            placeholder="Phone number"

                        />








                        <input

                            type="password"

                            value={password}

                            onChange={(e)=>
                                setPassword(e.target.value)
                            }

                            placeholder="Password"

                        />








                        <button
                            onClick={handleAuth}
                        >

                            {
                                loginMode
                                ?"Login"
                                :"Register"
                            }

                        </button>








                        <button

                            className="cancel"

                            onClick={()=>{

                                setLoginMode(
                                    !loginMode
                                );

                            }}

                        >

                            {
                                loginMode
                                ?"Create new account"
                                :"Already have account? Login"
                            }


                        </button>







                        <button

                            className="cancel"

                            onClick={()=>setShowAuth(false)}

                        >

                            Cancel

                        </button>




                    </div>


                </div>


            )}





        </div>


    );

}


export default DepositModal;
