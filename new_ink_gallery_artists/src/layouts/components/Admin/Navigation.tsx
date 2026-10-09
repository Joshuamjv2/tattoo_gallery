"use client";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../../context/hooks/Auth";
import { BiX, BiMenu } from "react-icons/bi";
import { GiDeadWood } from "react-icons/gi";
import { useState } from "react";


import {
    FaCalendar,
    FaPenFancy,
    FaArrowRight
} from "react-icons/fa6";
import { IoPerson } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";

export default function Sidebar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const { handleLogout} = useAuth();
    const location = useLocation(); // Get the current location

    const nav_items = [
        {name: "Appointments", logo: <FaCalendar />, link: "/admin"},
        {name: "Artists", logo: <IoPerson />, link: "/admin/artists"},
        {name: "Flash Designs", logo: <FaPenFancy/>, link: "/admin/designs"},
        {name: "Tattoo Inspos", logo: <GiDeadWood />, link: "/admin/tattoo_ideas"},
        {name: "Settings", logo: <IoMdSettings />, link: "/admin/settings"},
    ];


    return (
        <div className="md:h-screen w-full md:w-[15rem] bg-white relative md:border-r">
            <div className="px-4 flex items-center md:items-start md:flex-col border-b md:border-b-0">
                <div className="flex w-full p-4 md:justify-center">
                    <a href="/admin">
                        <img
                            src="/images/logo-black.png"
                            alt="Logo"
                            className="w-10 md:w-16 transition-all duration-300"
                        />
                    </a>
                </div>
                <div className="hidden md:flex flex-col gap-8 overflow-hidden mt-16">
                    {nav_items.map((item) => {
                        const isActive = location.pathname === item.link;
                        return (
                            <a
                                href={item.link}
                                key={item.name}
                                className={`flex gap-4 cursor-pointer px-2 py-2 rounded-md items-center ${
                                    isActive ? "text-black" : "text-black"
                                }`}
                            >
                                <p>{item.logo}</p>
                                <p className="font-semibold">{item.name}</p>
                            </a>
                        );
                    })}
                </div>
                {/* hamburger menu for small screens */}
                <div onClick={toggleMenu} className="md:hidden cursor-pointer z-20">
                        {isMenuOpen ? (
                        <BiX className="w-6 h-6" /> // Use className for sizing
                                ) : (
                        <BiMenu className="w-6 h-6" />
                    )}
                </div>
                <div className="hidden md:block absolute bottom-6" onClick={handleLogout}>
                    <div className="flex gap-2 items-center cursor-pointer font-semibold text-lg">
                        <p>
                            <FaArrowRight />
                        </p>
                        <p>Logout</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
