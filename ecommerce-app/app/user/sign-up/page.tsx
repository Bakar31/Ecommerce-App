"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
    name: string;
    email: string;
    password: string;
}


/* eslint-disable @next/next/no-img-element */
const SignUp = () => {
    const router = useRouter();
    const [formData, setFormData] = useState<User>({
        name: "",
        email: "",
        password: "",
    });
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [passwordsMatch, setPasswordsMatch] = useState<boolean>(true);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        if (name === "password") {
            setFormData({
                ...formData,
                [name]: value,
            });
            setPasswordsMatch(value === confirmPassword);
        } else if (name === "confirm-password") {
            setConfirmPassword(value);
            setPasswordsMatch(formData.password === value);
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleCreateUserSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!passwordsMatch) {
            console.error("Passwords do not match");
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:8000/api/user/createUser",
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
                name: "",
                email: "",
                password: "",
            });
            router.push("/user/sign-in");
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const googleAuthHandler = () => {
        window.location.href = 'http://localhost:8000/auth/google';
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
                            Create an account
                        </h1>
                        <form
                            className="space-y-4 md:space-y-6"
                            onSubmit={handleCreateUserSubmit}
                        >
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block mb-2 text-sm font-medium text-gray-900"
                                >
                                    Full Name
                                </label>
                                <input
                                    type="name"
                                    name="name"
                                    id="name"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    placeholder=""
                                    required
                                    onChange={handleChange}
                                />
                            </div>
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
                                    name="password"
                                    id="password"
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
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        id="terms"
                                        aria-describedby="terms"
                                        type="checkbox"
                                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600"
                                        required
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="terms" className="font-light text-gray-500">
                                        I accept the{" "}
                                        <a
                                            className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                                            href="#"
                                        >
                                            Terms and Conditions
                                        </a>
                                    </label>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full text-black bg-green-400 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600"
                            >
                                Create an account
                            </button>
                            <p className="text-sm font-light text-blac">
                                Already have an account?{" "}
                                <a
                                    href="/user/sign-in"
                                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                                >
                                    Login here
                                </a>
                            </p>
                        </form>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={googleAuthHandler}
                                className="text-white bg-blue-500 hover:bg-blue-400 focus:ring-4 focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mr-2 mb-2"
                            >
                                <svg
                                    className="mr-2 -ml-1 w-4 h-4"
                                    aria-hidden="true"
                                    focusable="false"
                                    data-prefix="fab"
                                    data-icon="google"
                                    role="img"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 488 512"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                                    ></path>
                                </svg>
                                Continue with Google
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SignUp;
