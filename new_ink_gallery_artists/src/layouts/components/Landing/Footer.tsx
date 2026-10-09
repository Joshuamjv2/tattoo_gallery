import { IoLogoFacebook } from "react-icons/io";
import { IoLogoInstagram } from "react-icons/io5";
export default function LandingFooter(){
    return <div className="flex justify-center font-geo font-medium w-full items-center flex-col gap-2 text-black bg-white/50 border-t border-t-black/20">
        <div className="my-4 px-4 hidden">
            <a href="/" className="cursor-pointer">
                <img width={80} src="/images/white-logo.png" alt="" />
            </a>
            <div className="flex items-center justify-center gap-4 mt-4">
                <a href="https://www.facebook.com/inkgallerynj" target="_blank" className="hover:scale-110 hover:duration-150 cursor-pointer">
                    <IoLogoFacebook size={20} />
                </a>
                
                <a href="https://www.instagram.com/inkgallerynj" target="_blank" className="hover:scale-110 hover:duration-150 cursor-pointer">
                    <IoLogoInstagram size={20} />
                </a>
            </div>
        </div>

        <div className="w-full py-6 text-sm">
            <p className="text-center text-black/60">&copy; {new Date().getFullYear()} <a href="/" target="_blank"><span className="font-bold text-[.9rem]  text-black font-roboto">Ink Gallery Tattoo Studio.</span></a> All rights reserved.</p>
            <p className="text-center text-black/60">Made by <a href="mailto:joshuamjv22@gmail.com" target="_blank" className="font-bold text-[.9rem] cursor-pointer hover:duration-150 text-black font-roboto">Muwanguzi Joshua</a></p>
        </div>
        {/* <p className="hidden sm:block">All rights reserved</p> */}
    </div>
}