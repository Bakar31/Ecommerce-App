/* eslint-disable react/no-unescaped-entities */
"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  email: string;
  newPassword: string;
}

/* eslint-disable @next/next/no-img-element */
const ForgetPassword = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<User>({
    email: "",
    newPassword: "",
  });
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordsMatch, setPasswordsMatch] = useState<boolean>(true);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "newPassword") {
      setFormData({
        ...formData,
        [name]: value,
      });
      setPasswordsMatch(value === confirmPassword);
    } else if (name === "confirm-password") {
      setConfirmPassword(value);
      setPasswordsMatch(formData.newPassword === value);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleResetPasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!passwordsMatch) {
      console.error("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8000/api/user/resetPassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      console.log(data);

      setFormData({
        email: "",
        newPassword: "",
      });
      router.push("/user/sign-in");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <section className="bg-base-80">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="#"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900"
        >
          <img
            className="w-15 h-6 mr-2"
            src="https://www.sazim.io/_next/static/media/sazim-logo.a56d8831.svg"
            alt="logo"
          />
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Update password
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={handleResetPasswordSubmit}
            >
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="name@company.com"
                  required
                  onChange={handleChange}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  required
                  onChange={handleChange}
                />
              </div>
              <div>
                <label
                  htmlFor="confirm-password"
                  className="block mb-2 text-sm font-medium text-gray-90"
                >
                  Confirm password
                </label>
                <input
                  type="password"
                  name="confirm-password"
                  id="confirm-password"
                  placeholder="••••••••"
                  autoComplete="confirm-password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  required
                  onChange={handleChange}
                />
                {!passwordsMatch && (
                  <p className="text-red-500 text-sm">Passwords do not match</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full text-black bg-green-400 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600"
              >
                Update Password
              </button>
              <p className="text-sm font-light text-blac">
                Don't have an account?{" "}
                <a
                  href="/user/sign-up"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Sign up here
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgetPassword;
