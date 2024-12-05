import { useState, useEffect } from "react";
import axios from "axios";
export default function Login({state,NavigateTo, handleUserData}) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  async function handleLogin(e) {
    // e.prevent.default();
    //alert("LOGIN")
    const result = await axios.post("http://localhost:8000/api/user/login", {
      email: email,
      password: pass
    });
    console.log(result);



    if (result.status == 200) {
      const token = result.data.data["token"];
      alert(token);
      localStorage.setItem("token", token);
      NavigateTo('HomePage')
      handleUserData(result.data.data['user'])
    }
  }
  return (
    <div className="container">
      <div className="left-panel">
        <img
          src="../../public/img/login.png"
          alt="Phone and shopping cart"
          className="image"
        />
      </div>
      <div className="right-panel">
        <div className="form-container">
          <h1 className="form-title">Đăng nhập</h1>

          <form>
            <div className="form-group">
              <input
                type="email"
                id="email"
                name="email"
                className="input"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                id="password"
                name="password"
                className="input"
                placeholder="Mật khẩu"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-primary"
                onClick={handleLogin}
              >
                Đăng nhập
              </button>
              <div className="forgot-password">
                <a href="#" className="link">
                  Quên mật khẩu?
                </a>
              </div>
            </div>

            <div className="divider">
              <hr className="line" />
              <span>hoặc</span>
              <hr className="line" />
            </div>

            <div className="form-footer">
              <p>
                Bạn chưa có tài khoản?{" "}
                <span
                  className="link"
                  onClick={() =>
                    setMode((prev) => (prev === "login" ? "signup" : "login"))
                  }
                >
                  Đăng ký
                </span>
              </p>
              <p>
                Bạn là chủ shop? <span className="link">Kênh người bán</span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
  
    // return (
    //   <div className="Login-log">
    //     <div className="flex w-full">
    //       <div className="w-7/12 p-4 flex items-center justify-center">
    //         <img src="../../public/img/login.png" alt="login-img" className="w-3/4" />
    //       </div>

    //       <div className="w-5/12 p-4 flex justify-center items-center">
    //         <div className="w-full">
    //           <h1 className="text-3xl font-bold text-left mb-6" >Đăng nhập</h1>


    //           <form action="#" method="POST">

    //             <div className="mb-4">
    //               <input
    //                 type="email"
    //                 id="email"
    //                 name="email"
    //                 className={`mt-1 p-2  w-4/5 border-b border-black hover:bg-blue-100 ${email != "" ? 'bg-blue-100' : null}`}
    //                 placeholder="Email"
    //                 onChange={(e) => setEmail(e.target.value)}
    //               />
    //             </div>

    //             <div className="mb-4">
    //               <input
    //                 type="password"
    //                 id="password"
    //                 name="password"
    //                 className={`mt-1 p-2 w-4/5 border-b border-black  ${pass != "" ? "bg-blue-100" : null}`}
    //                 placeholder="Mật khẩu"
    //                 onChange={(e) => setPass(e.target.value)}
    //               />
    //             </div>

    //             <div className="flex items-center">
    //               <button
    //                 type="button"
    //                 className="p-6 bg-red-600 text-white py-2 rounded-lg  hover:bg-red-700"
    //                 onClick={handleLogin}
    //               >
    //                 Đăng nhập
    //               </button>
    //               <div className="mt-4 text-center ml-20 ">
    //                 <a href="#" className=" text-red-500 hover:text-red-700 text-md">Quên mật khẩu ?</a>
    //               </div>


    //             </div>

    //             <div className="block my-4 space-x-4">
    //               <span>Bạn chưa có tài khoản?</span>
    //               <span className="border-b border-black p-1" onClick={() => setMode((prev) => {
    //                 if (prev == "login") "signup"
    //                 else "login"
    //               })}>
    //                 Đăng ký
    //               </span>
    //             </div>

    //             <div className="block my-4 space-x-4">
    //               <span>Bạn là chủ shop?</span>
    //               <span className="border-b border-black p-1">Kênh người bán</span>
    //             </div>
    //           </form>

    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // )
}
