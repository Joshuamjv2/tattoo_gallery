import { useState } from "react";
import { BiMenu, BiX } from "react-icons/bi";
import { useLocation } from "react-router-dom";
import { usePopup } from "../../../context/hooks/usePopUp";

export default function Navigation() {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { handleHidePopup } = usePopup();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const isActive = (path: string) => location.pathname.includes(path.toLowerCase());

    return (
        <div className="w-full relative p-[1rem]">
            <div className="absolute inset-0 z-0 left-0 right-0 w-full">
                <img
                    className="w-full h-full object-cover inset-0"
                    src="images/black_pattern.jpg"
                    alt="Navigation background"
                />
            </div>

            <div className="mx-2 md:mx-4 lg:mx-8 px-8 py-6 flex justify-between items-center rounded-md relative overflow-hidden bg-white">
                {/* Nav content background overlay */}
                <div className="absolute h-full w-full z-10 inset-0"></div>

                {/* Desktop Nav */}
                <div className="relative z-10 font-bangers">
                    <ul className="gap-8 items-center hidden md:flex">
                        <a href="/" className="hover:text-black">
                            <li className={`font-semibold text-lg ${isActive("/") ? "text-black" : "text-black"}`}>
                                Artists
                            </li>
                        </a>
                        <a href="/designs" className="hover:text-black">
                            <li className={`font-semibold text-lg ${isActive("/designs") ? "text-black" : "text-black"}`}>
                                Flash Designs
                            </li>
                        </a>
                        <a href="/tattoo_ideas" className="hover:text-black">
                            <li className={`font-semibold text-lg ${isActive("/tattoo_ideas") ? "text-black" : "text-black"}`}>
                                Tattoo Inspo
                            </li>
                        </a>
                    </ul>
                </div>

                {/* Hamburger */}
                <div onClick={toggleMenu} className="md:hidden absolute right-4 cursor-pointer z-20">
                    {isMenuOpen ? (
                        <BiX className="w-6 h-6" />
                    ) : (
                        <BiMenu className="w-6 h-6" />
                    )}
                </div>

                {/* Centered logo */}
                <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 z-10">
                    <a href="/">
                        <img
                            src="images/logo-black.png"
                            alt="Logo"
                            className="w-10 md:w-14 transition-all duration-300"
                        />
                    </a>
                </div>

                {/* Book Appointment - Desktop */}
                <button
                    onClick={() => {
                        handleHidePopup({ show: true, type: "create", data: { page: "appointments" } });
                    }}
                    className="outline-none font-bangers  font-bold cursor-pointer hover:duration-150 hidden md:block py-2 bg-black text-white rounded-md px-4 z-30"
                >
                    Book Appointment
                </button>
            </div>

            {/* Mobile Navigation Menu */}
            {isMenuOpen && (
                <div className="fixed inset-0 bg-white z-30 flex flex-col justify-between px-4 pt-4 backdrop-blur-sm transition-all duration-300">
                    <div className="flex flex-col">
                    <div className="flex justify-between mb-4">
                        <div>
                            <a href="/">
                                <img
                                    src="images/logo-black.png"
                                    alt="Logo"
                                    className="w-10 md:w-20 transition-all duration-300"
                                />
                            </a>
                        </div>
                        <div onClick={toggleMenu}><BiX className="w-8 h-8"/></div>
                    </div>
                    <div className="inset-0 z-0 left-0 right-0 w-full mb-4">
                        <img
                            className="w-full h-[20vh] object-cover inset-0"
                            src="images/black_pattern.jpg"
                            alt="Navigation background"
                        />
                    </div>
                    <div className="flex flex-col gap-6 text-black text-xl font-semibold font-bangers">
                        <a href="/" className="hover:text-gray-300">
                            Artists
                        </a>
                        <a href="/designs" className="hover:text-gray-300">
                            Flash Designs
                        </a>
                        <a href="/tattoo_ideas" className="hover:text-gray-300">
                            Tattoo Inspo
                        </a>
                        <button
                            onClick={() => {
                                toggleMenu();
                                handleHidePopup({ show: true, type: "create", data: { page: "appointments" } });
                            }}
                            className="mt-4 px-6 py-2 rounded-md bg-black text-white font-bangers text-lg"
                        >
                            Book Appointment
                        </button>
                    </div>
                    </div>

                    <div className="flex mb-4">
                    <div className="w-full py-6 text-sm">
                        <p className="text-center text-black/60">&copy; {new Date().getFullYear()} <a href="/" target="_blank"><span className="font-bold text-[.9rem]  text-black font-roboto">Ink Gallery Tattoo Studio.</span></a> All rights reserved.</p>
                        <p className="text-center text-black/60">Made by <a href="mailto:joshuamjv22@gmail.com" target="_blank" className="font-bold text-[.9rem] cursor-pointer hover:duration-150 text-black font-roboto">Muwanguzi Joshua</a></p>
                    </div>
                    </div>
                </div>
            )}
        </div>
    );
}
