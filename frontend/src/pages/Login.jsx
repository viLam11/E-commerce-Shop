import { useState, useEffect } from "react";

import Header from "../components/Header";
export default function Login() {
  return (
    <div className="h-full">
      <Header />

      <div className="flex w-full h-screen">
        <div className="w-7/12 p-4 flex items-center justify-center">
          <img src="../../public/login.png" alt="login-img" className="w-3/4" />
        </div>

        <div className="w-5/12 p-4 flex justify-center items-center">
          <div className="w-full">
            <h1 className="text-3xl font-bold text-left mb-6">Đăng nhập</h1>


            <form action="#" method="POST">

              <div className="mb-4">
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="mt-1 p-2  w-4/5 border-b border-black"
                  placeholder="Email"
                />
              </div>

              <div className="mb-4">
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="mt-1 p-2 w-4/5 border-b border-black"
                  placeholder="Mật khẩu"
                />
              </div>

              <div className="flex items-center">
                <button
                  type="submit"
                  className="p-6 bg-red-600 text-white py-2 rounded-lg  hover:bg-red-700"
                >
                  Đăng nhập
                </button>
                <div className="mt-4 text-center ml-20 ">
                  <a href="#" className=" text-red-500 hover:text-red-700 text-md">Quên mật khẩu ?</a>
                </div>
              </div>


            </form>

          </div>
        </div>
      </div>
    </div>
  )
}
