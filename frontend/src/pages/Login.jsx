import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import DayPick from "../components/DayPick.jsx";

export default function Login() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState([]);
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [phone, setPhone] = useState(null);
  const [gender, setGender] = useState(null);
  const [role, setRole] = useState("customer");
  const [dateOfBirth, setDateOfBirth] = useState({
    day: "",
    month: "",
    year: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDateOfBirth({
      ...dateOfBirth,
      [name]: value,
    });
  };

  const { day, month, year } = dateOfBirth;


  async function handleLogin(e) {
    axios.post("http://localhost:8000/api/user/login", {
      email: email,
      password: pass
    })
      .then((response) => {
        if (response.status == 200) {
          const token = response.data.data.token;
          const userType = response.data.data.userType;
          console.log(response, "token: ", token);
          localStorage.setItem("token", token);
          localStorage.setItem("role", userType);
          if(userType == "customer") navigate("/homepage")
          else navigate("/product-manage")
        }
      })
      .catch((error) => {
        if (error.response) {
          alert(error.response.data.msg);
        } else {
          console.error('Error:', error.message);
        }
      })
  }

  async function handleSignUp(e) {
    // const result = await axios.post("http://localhost:8000/api/user/signUp", {
    //   email: email,
    //   password: pass,
    //   confirmPassword: pass,
    //   fname: fname,
    //   lname: lname,
    //   gender: gender,
    //   userType: role,
    //   birthday: `${day}-${month}-${year}`
    // })


    // if (result.status == 200) {
    //   alert("Sigup success!");
    // } 
    axios.post("http://localhost:8000/api/user/signUp", {
      email: email,
        password: pass,
        confirmPassword: pass,
        fname: fname,
        lname: lname,
        gender: gender,
        userType: role,
        birthday: `${day}-${month}-${year}`
    })
      .then((response) => {
        if (response.status == 200) {
          alert("Create account success");
          navigate("/")
        }
      })
      .catch((error) => {
        if (error.response) {
          alert(error.response.data.msg);
        } else {
          console.error('Error:', error.message);
        }
      })
  }

  if (mode == "login") {
    return (
      <div className="">
        <Header role="customer" />

        <div className="flex w-full">
          <div className="w-7/12 p-4 flex items-center justify-center">
            <img src="./login.png" alt="login-img" className="w-3/4" />
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

                {/* <div className="block my-4 space-x-4">
                  <span>Bạn là chủ shop?</span>
                  <span className="border-b border-black p-1">Kênh người bán</span>
                </div> */}
              </form>

            </div>
          </div>
        </div>

        <Footer />
      </div>
    )
  }
  else {
    return (

      <div className="">
        <Header role="customer" />

        <div className="flex w-full">
          <div className="w-7/12 p-4 flex items-center justify-center">
            <img src="./login.png" alt="login-img" className="w-3/4" />
          </div>

          <div className="w-5/12 p-4 flex justify-center items-center">
            <div className="w-full">
              <h1 className="text-3xl font-bold text-left mt-6 mb-4">Tạo tài khoản</h1>
              <div className="text-sm mb-6">Vui lòng điền các thông tin sau </div>

              <form action="#" method="POST">

                <div className="space-y-6 w-full">

                  <div className="mb- flex items-end w-full">
                    <div className="w-1/2">
                      <div>Họ</div>
                      <input
                        type="text"
                        id="name"
                        name="firstName"
                        className={`mt-1 p-2  w-4/5 border-b border-black hover:bg-blue-100 ${name != "" ? 'bg-blue-100' : null}`}
                        placeholder="Huỳnh Bảo"
                        onChange={(e) => setLname(e.target.value)}
                      />
                    </div>

                    <div className="w-1/2">
                      <div>Tên</div>
                      <input
                        type="text"
                        id="name"
                        name="lastName"
                        className={`mt-1 p-2  w-4/5 border-b border-black hover:bg-blue-100 ${name != "" ? 'bg-blue-100' : null}`}
                        placeholder="Ngọc"
                        onChange={(e) => setFname(e.target.value)}
                      />
                    </div>

                  </div>
                  <div className="mb-4">
                    <div>Email</div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className={`mt-1 p-2  w-4/5 border-b border-black hover:bg-blue-100 ${email !== "" ? 'bg-blue-100' : null}`}
                      placeholder="ngoc@gmail.com"
                      onChange={(e) => setEmail(e.target.value)}
                    />

                  </div>

                  <div>
                    <div>Số điện thoại</div>
                    <input
                      type="number"
                      id="phone"
                      name="phone"
                      className={`mt-1 p-2  w-4/5 border-b border-black hover:bg-blue-100 ${phone != "" ? 'bg-blue-100' : null}`}
                      placeholder="09xxxx"
                      onChange={(e) => setPhone(e.target.value)}
                    />

                  </div>

                  <div className="mb-4">
                    <div>Mật khẩu</div>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className={`mt-1 p-2 w-4/5 border-b border-black  ${pass != "" ? "bg-blue-100" : null}`}
                      placeholder="****"
                      onChange={(e) => setPass(e.target.value)}
                    />
                  </div>

                  <div className="mb-4 flex space-x-2">
                    <div className="pr-4">Giới tính</div>
                    <input type="radio" id="male" value="male" name="gender" onClick={() => {setGender("male")}} />
                    <label htmlFor="male">Nam</label>
                    <input type="radio" id="female" value="female" name="gender" onClick={() => {setGender("female")}} />
                    <label htmlFor="female">Nữ</label>
                    <input type="radio" id="null" value="null" name="gender" onClick={() => {setGender(null)}} />
                    <label htmlFor="null">Khác</label>
                  </div>

                  <div className="dob-container">
                    <div className="flex items-center">
                      <span className="pr-4">Ngày sinh:</span>
                      <div className="flex">
                      <span className="inline-block w-10">
                        <input
                          type="number"
                          min={0}
                          max={31}
                          name="day"
                          value={day}
                          onChange={handleInputChange}
                          placeholder="DD"
                          className="border-b text-center inline-block w-10"
                        />
                      </span>/
                      <span className="inline-block w-10">
                        <input
                          type="number"
                          name="month"
                          value={month}
                          onChange={handleInputChange}
                          placeholder="MM"
                          className="border-b text-center inline-block w-10"
                        />
                      </span>/
                      <span className="inline-block w-10">
                        <input
                          type="number"
                          name="year"
                          value={year}
                          onChange={handleInputChange}
                          placeholder="YYYY"
                          className="border-b text-center inline-block w-10"
                        />
                      </span>
                      </div>

                    </div>
                  </div>

                  <div className="role flex space-x-2">
                      <div>Bạn là nhân viên ? </div>
                      <input type="radio" value="admin" name="role" onClick={() => {setRole("admin")}} />
                      <label htmlFor="role">Đúng</label>
                      <input type="radio" value="customer" name="role" onClick={() => {setRole("customer")}} />
                      <label htmlFor="role">Không</label>
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

        <Footer />
      </div>
    )
  }
}
