import { useAuth } from "../../../context/hooks/Auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {Login as LoginData} from "../../../types/Auth"
import { FaEye, FaEyeSlash } from "react-icons/fa6";

const Login = () => {
    const { handleLogin, currentUser } = useAuth();
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm<LoginData>();
    const [showPassword, setShowPassword] = useState(false)

    const onSubmit = async (data: LoginData) => {
        try {
            await handleLogin?.(data);
            navigate("/admin");
        } catch (error) {
            console.log(error)
            toast.error("Login failed. Please check your credentials.");
        }
    };

    useEffect(() => {
        if (currentUser) {
            navigate("/admin");
        }
    }, [currentUser, navigate]);

    return (
        <div className="flex flex-col justify-center xl:flex-row items-center h-screen">
            <div className="w-[70%] hidden h-full xl:flex items-center justify-center border-r border-black">
                <img width={400} src="/images/logo-black.png" alt="seere logo" />
            </div>
            <div className="bg-primary h-full w-[30%] flex items-center justify-center">
                <div className="flex flex-col justify-center items-center h-1/2  gap-12">
                    <div className="text-black max-w-72 mb-8 flex justify-center items-center">
                        <div className="h-full flex items-center pr-4 justify-center border-r border-black">
                            <img width={40} src="/images/logo-black.png" alt="New ink gallery logo" />
                        </div>
                        <h1 className="font-bold text-2xl text-center pl-4">Login</h1>
                        {/* <p className="font-bold text-center uppercase text-lg">Login</p> */}
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-2 flex flex-col gap-4">
                            <div>
                                <input
                                    type="text"
                                    className="rounded-md py-2 px-2 w-[20rem] bg-red-300 outline-none bg-transparent border active:bg-transparent"
                                    placeholder="Email"
                                    {...register("email", { required: true, pattern: /^\S+@\S+$/ })}
                                />
                            </div>
                            <div className="flex justify-between items-center rounded-md py-2 px-2 w-[20rem] outline-none bg-transparent border">
                                <input
                                    className="outline-none bg-transparent active:bg-transparent"
                                    type={!showPassword ? "password": "text"}
                                    placeholder="Password"
                                    {...register("password", { required: true })}
                                />
                                <div onClick={()=>setShowPassword(!showPassword)} >{!showPassword ? <FaEyeSlash /> : <FaEye />}</div>
                            </div>
                        </div>
                        <a href="/forgot_password">
                            <p className="mb-2 text-white font-semibold cursor-pointer text-sm">Forgot password?</p>
                        </a>
                        <button type="submit" className="text-white bg-black rounded py-1 px-2 outline-none focus:outline-none active:outline-none">Login</button>
                        {/* <Button type="submit" text="Login" styling="px-6 py-2" /> */}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
