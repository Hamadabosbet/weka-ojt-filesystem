import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import ForgotPassword from "../components/ForgotPassword.jsx";
import Login from "../components/Login.jsx"


function LogIn(props) {
  const [showLogin,setshowLogin] = useState("True");
  const [Forgotpassword, setForgotpassword] = useState("False");
  const [Signup, setSignup] = useState("False");
  const navigate = useNavigate();

//  useEffect(() => {
//     setLogin(props.LogIn);
//   }, [props.LogIn]);
//
//     const handleUpdateLogin = (newValue) => {
//     setLogin(newValue);
//   };

  return (
     <div>
        <meta charSet="UTF-8" />
        <title>Log In</title>
        <style dangerouslySetInnerHTML={{__html: "\n    b {\n      background-image: url('Image/bbr.jpg');\n      background-repeat: repeat-y;\n      background-size: cover; /* Resize the background image to cover the entire container */\n\n\n    }\n  " }} />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossOrigin="anonymous" />
        <div className="row  border  m-5">
          <h1 className=" text-center">
            Store your files
          </h1>
        </div>
        <div className="row  justify-content-center d-flex  " style={{margin: '100px', marginRight: '100px', left: 'auto'}}>
          <b className="row">



            <div className="col-lg-6 lead container-sm vh-60 bg-light bg-transparent  ">
              <div className="row shadow border border-2 justify-content-center justify-content-lg-around  m-5 " style={{backgroundColor: '#EDEDED'}}>



          {  props.LogIn=="True" ?
          <div>
          <Login/>
          </div>
               :<div></div>
          }


           {Signup==="True"?

              <div className="signup">

                <div>
                 <h1>Sign Up</h1>
                 <div className="form-group text-start ">
                   <label>User Name</label>
                   <input type="UserName" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="User Name" />
                 </div>
                 <div className="form-group text-start ">
                   <label>Email address</label>
                   <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
                 </div>

                 <div className="form-group text-start">
                   <label>Password</label>
                   <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" />
                 </div>
                 <div>
{/*                    <small><a className="text-sm-end m-1" href="#"><span>Forget Password</span></a></small> */}

                   <small>
                    <div onClick={()=>{setLogin("True"),setSignup("False")}}>

                   <a className="text-sm-start m-1 t" href="#"><span>Sign In</span></a></div></small>

                 </div>
                 <button type="submit" className="btn btn-primary">Sign Up</button>
               </div>
              </div>
             :<div></div>
              }


{/*           {Forgotpassword==="True"? */}
{/*                         <div> */}

{/*                <ForgotPassword Forgotpassword="True" /> */}
{/*                {handleUpdateLogin("True")} */}

{/*                </div> */}
{/*               :<div></div> */}
{/*               } */}

              </div>
              </div>



            <div className="col-lg-6 vh-60n border-start  p-3 ">
              <div className="row lead container-sm  text-dark">
                <h1>About</h1>
                <small> The web is about saving and sharing your fie
                  File sharing allows users to use software that connects into a network
                  to search for shared files from other users.File sharing allows users to use software that connects into a network
                  to search for shared files from other users.</small>
              </div>
            </div>
          </b>
        </div>
        <footer className="text-center py-1" id="footer">
          <p>© 2024 Fyle System. All rights reserved.</p>
        </footer>
       </div>

  );
}

export default LogIn;
