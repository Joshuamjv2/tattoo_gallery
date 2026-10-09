import { BsInstagram, BsTwitterX, BsGlobe } from "react-icons/bs";
import { FaEnvelope } from "react-icons/fa6";
import { Link } from "react-router-dom";

export default function LandingFooter() {
    return (
        <footer className=" text-black mt-20 border-t">
            <div className="w-full  mx-auto px-[1rem] py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Site Navigation */}
                <div>
                    <h4 className="text-lg font-semibold mb-8">Explore</h4>
                    <ul className="space-y-8 text-sm">
                        <li><Link to="/about" className="hover:text-black/90 text-black/70">About</Link></li>
                        <li><a href="https://main-website.com" target="_blank" rel="noopener noreferrer" className="hover:text-black/90 text-black/70">Main Website</a></li>
                        <li>
                            <Link to="/booking">
                                <button className="bg-black text-white px-4 py-2 mt-4 rounded hover:bg-gray-200 transition">
                                    Book an Appointment
                                </button>
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Socials */}
                <div>
                    <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
                    <div className="flex gap-4 text-2xl">
                        <a href="https://instagram.com/yourstudio" target="_blank" rel="noopener noreferrer" className="hover:text-black/80">
                            <BsInstagram />
                        </a>
                        <a href="https://twitter.com/yourstudio" target="_blank" rel="noopener noreferrer" className="hover:text-black/80">
                            <BsTwitterX />
                        </a>
                        <a href="https://yourwebsite.com" target="_blank" rel="noopener noreferrer" className="hover:text-black/80">
                            <BsGlobe />
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="text-center py-2 text-sm text-black/60 flex justify-between">
                <div className="flex gap-1">
                    <div>&copy; {new Date().getFullYear()}</div> 
                    <div> New Ink Gallery. All rights reserved.</div>
                </div>
                <div className="flex gap-2 items-center"><div className="text-black font-semibold">Built by:</div> <div><a
                        href="mailto:joshua@example.com"
                        className="text-sm inline-flex items-center gap-1 text-black/70 hover:text-black"
                    >
                    joshua@example.com
                    </a>
                </div></div>
            </div>
        </footer>
    );
}
