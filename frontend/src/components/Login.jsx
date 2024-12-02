import { useState, useEffect } from "react";
import axios from "axios";
export default function Login() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

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
    }
  }

  async function handleSignUp(e) {
    const result = await axios.post("http://localhost:8000/api/user/signUp", {
      email: email,
      password: pass,
      confirmPassword: pass,
      fname: name,
      lname: name,
      gender: "female",
      userType: "customer",
      birthday: "2004-02-22"
    })

    if(result.status == 200) {
      alert("Sigup success!");
    }
  }

  if (mode == "login") {
    return (
      <div className="Login-log">
        <div className="flex w-full">
          <div className="w-7/12 p-4 flex items-center justify-center">
            <img src="../../public/img/login.png" alt="login-img" className="w-3/4" />
          </div>

          <div className="w-5/12 p-4 flex justify-center items-center">
            <div className="w-full">
              <h1 className="text-3xl font-bold text-left mb-6" >Đăng nhập</h1>


              <form action="#" method="POST">

                <div className="mb-4">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`mt-1 p-2  w-4/5 border-b border-black hover:bg-blue-100 ${email != "" ? 'bg-blue-100' : null}`}
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className={`mt-1 p-2 w-4/5 border-b border-black  ${pass != "" ? "bg-blue-100" : null}`}
                    placeholder="Mật khẩu"
                    onChange={(e) => setPass(e.target.value)}
                  />
                </div>

                <div className="flex items-center">
                  <button
                    type="button"
                    className="p-6 bg-red-600 text-white py-2 rounded-lg  hover:bg-red-700"
                    onClick={handleLogin}
                  >
                    Đăng nhập
                  </button>
                  <div className="mt-4 text-center ml-20 ">
                    <a href="#" className=" text-red-500 hover:text-red-700 text-md">Quên mật khẩu ?</a>
                  </div>


                </div>

                <div className="block my-4 space-x-4">
                  <span>Bạn chưa có tài khoản?</span>
                  <span className="border-b border-black p-1" onClick={() => setMode((prev) => {
                    if (prev == "login") "signup"
                    else "login"
                  })}>
                    Đăng ký
                  </span>
                </div>

                <div className="block my-4 space-x-4">
                  <span>Bạn là chủ shop?</span>
                  <span className="border-b border-black p-1">Kênh người bán</span>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    )
  }
  else {
    return (
      <div className="">
        <div className="flex w-full">
          <div className="w-7/12 p-4 flex items-center justify-center">
            <img src="./login.png" alt="login-img" className="w-3/4" />
          </div>

          <div className="w-5/12 p-4 flex justify-center items-center">
            <div className="w-full">
              <h1 className="text-3xl font-bold text-left mt-6 mb-4">Tạo tài khoản</h1>
              <div className="text-sm mb-6">Vui lòng điền các thông tin sau </div>

              <form action="#" method="POST">

                <div className="space-y-6">
                  <div className="mb-4">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className={`mt-1 p-2  w-4/5 border-b border-black hover:bg-blue-100 ${name != "" ? 'bg-blue-100' : null}`}
                      placeholder="Tên"
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className={`mt-1 p-2  w-4/5 border-b border-black hover:bg-blue-100 ${email != "" ? 'bg-blue-100' : null}`}
                      placeholder="Email"
                      onChange={(e) => setEmail(e.target.value)}
                    />

                  </div>

                  <div>
                    <input
                      type="number"
                      id="phone"
                      name="phone"
                      className={`mt-1 p-2  w-4/5 border-b border-black hover:bg-blue-100 ${phone != "" ? 'bg-blue-100' : null}`}
                      placeholder="Số điện thoại"
                      onChange={(e) => setPhone(e.target.value)}
                    />

                  </div>

                  <div className="mb-4">
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className={`mt-1 p-2 w-4/5 border-b border-black  ${pass != "" ? "bg-blue-100" : null}`}
                      placeholder="Mật khẩu"
                      onChange={(e) => setPass(e.target.value)}
                    />
                  </div>
                </div>


                <div className="flex items-center mt-6">
                  <button
                    type="button"
                    className="p-6 bg-red-600 text-white py-2 rounded-lg  hover:bg-red-700 w-4/5"
                    onClick={handleSignUp}
                  >
                    Đăng ký tài khoản
                  </button>


                </div>

                <div className="block my-6 space-x-4">
                  <span>Tôi đã có tài khoản?</span>
                  <span className="border-b border-black p-1" onClick={() => setMode("login")}>
                    Đăng nhập
                  </span>
                </div>


              </form>

            </div>
          </div>
        </div>
      </div>
    )
  }
}
