import { useState } from "react";
import { Icon } from "@blueprintjs/core";
import loginStyles from "./login.module.scss";
import { useNavigate, Route, Routes } from "react-router-dom";
import Link from '@mui/material/Link';
import axios from "axios";
import Swal from "sweetalert2";

const Login = () => {

  const [action, setAction] = useState("Login");
  const [loading, setLoading] = useState(false);  // New loading state
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitL = async () => {
    try {
      setLoading(true); // Set loading to true on button click
      const response = await axios.post(
        "http://127.0.0.1:5000/login",
        formData
      );
      console.log(response.data)
      if (response.data.success) {
        sessionStorage.setItem('userData', JSON.stringify(response.data.user));
        Swal.fire("login successfull");
        navigate("/dashboard",{ state: {name:response.data.user[1]} });
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false); // Set loading to false after request completes (success or failure)
    }
  };

  const handleSubmitR = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/register",
        formData
      );
      setFormData({
        email: "",
        name: "",
        password: "",
      });
      setAction("Login");
    } catch (error) {
      // Handle error, e.g., show error message to the user
      console.error("Registration failed:", error);
    }
  };
  return (
    <>

      <div className={loginStyles.loginPage}>
        {/* <video id="video-background" src="your-local-video.mp4" muted loop /> */}
        <div className={loginStyles.container}>
          <div className={loginStyles.header}>
            <div className={loginStyles.text}>{action}</div>
            <div className={loginStyles.underline}></div>
          </div>
          <div className={loginStyles.inputs}>
            {action === "Login" ? (
              <div></div>
            ) : (
              <div className={"input"}>
                <Icon icon="at" size={23} className={loginStyles.icon} />
                <input
                  type="text"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            )}
            <div className="input">
              <Icon size={23} icon="user" className={loginStyles.icon} />
              <input
                type="text"
                placeholder="Username"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="input">
              <Icon size={23} icon="key" className={loginStyles.icon} />
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>
          {/* <div className={loginStyles.forgetPassword}>
            {action === "Sign Up" ? (
              <div></div>
            ) : (
              <div className={"forgotpassword"}>
                Forget password ?<span>Click Here</span>
              </div>
            )}
          </div> */}
          <div className="submit-container">
        {loading ? ( // Display loading UI if loading is true
          <div className="loader" >
            <div className="circle"></div>
            <div className="circle"></div>
            <div className="circle"></div>
            <div className="circle"></div>
          </div>
        ) : (
          action === "Login" ? (
            <>
              <button
                className={action === "Login" ? "submit gray" : "submit"}
                onClick={handleSubmitL}
              >Login</button>
              <Link
                style={{ color: "white" }}
                onClick={() => {
                  setAction("Sign Up");
                }}
              >
                Don't have an account? register here
              </Link>
            </>
          ) : (
            <>
              <button
                className={action === "Sign Up" ? "submit gray" : "submit"}
                onClick={handleSubmitR}
              >Sign Up</button>
              <Link
                style={{ color: "white" }}
                onClick={() => {
                  setAction("Login");
                }}
              >
                Already have an account, login here
              </Link>
            </>
          )
        )}
      </div>
        </div>
      </div>
    </>
  );
};

export default Login;




// import { useState } from "react";
// import { Icon } from "@blueprintjs/core";
// import loginStyles from "./login.module.scss";
// import { useNavigate, Link } from "react-router-dom";

// const Login = () => {
//   const [action, setAction] = useState("Login");
//   const navigate = useNavigate();

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const formData = new FormData(event.currentTarget);
//     const user = {
//       email: formData.get('email'),
//       name: formData.get('name'),
//       password: formData.get('password'),
//     };

//     if (!user.email || !user.password) {
//       console.log("Please provide email and password");
//       return;
//     }

//     try {
//       const response = await fetch(`http://127.0.0.1:5000/${action.toLowerCase()}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(user),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log(data);
//         // Handle success, maybe update state or navigate to another page
//       } else {
//         console.error('Error calling API:', response.statusText);
//         // Handle error, display an error message to the user
//       }
//     } catch (error) {
//       console.error('Error calling API:', error.message);
//     }
//   };

//   return (
//     <>
//       <div className={loginStyles.loginPage}>
//         {/* Video background code here */}
//         <video id="video-background" src="your-local-video.mp4" muted loop />

//         <div className={loginStyles.container}>
//           <div className={loginStyles.header}>
//             <div className={loginStyles.text}>{action}</div>
//             <div className={loginStyles.underline}></div>
//           </div>
//           <div className={loginStyles.inputs}>
//             {action === "Login" ? null : (
//               <div className={"input"}>
//                 <Icon icon='at' size={23} className={loginStyles.icon} />
//                 <input type="text" placeholder="Email" name='email' />
//               </div>
//             )}
//             <div className="input">
//               <Icon size={23} icon='user' className={loginStyles.icon} />
//               <input type="text" placeholder="Username" name='name' />
//             </div>
//             <div className="input">
//               <Icon size={23} icon='key' className={loginStyles.icon} />
//               <input type="password" placeholder="Password" name='password' />
//             </div>
//           </div>
//           <div className={loginStyles.forgetPassword}>
//             {action === "Sign Up" ? null : (
//               <div className={"forgotpassword"}>
//                 Forget password ?<span>Click Here</span>
//               </div>
//             )}
//           </div>
//           <div className="submit-container">
//             <div className={action === "Login" ? "submit gray" : "submit"} onClick={handleSubmit}>
//               {action}
//             </div>
//             <Link
//               style={{ color: "white" }}
//               onClick={() => {
//                 setAction(action === "Login" ? "Sign Up" : "Login");
//               }}
//             >
//               {action === "Login" ? "Don't have an account" : "Already have an account"}
//             </Link>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Login;



