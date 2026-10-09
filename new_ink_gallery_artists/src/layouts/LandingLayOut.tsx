import { ReactNode } from "react";
import Navigation from "./components/Landing/Navigation";
import LandingFooter from "./components/Landing/Footer";
import InfiniteScroller from "../components/common/InfinitScroller";
import { usePopup } from "../context/hooks/usePopUp";
import CreateGeneralAppointment from "../pages/landing/BookAppointment/CreateAppointment";

interface LandingLayoutProps {
    children: ReactNode;
    banner?: string;
    infinite_scroller?: string[],
    styled?: boolean
}

export default function LandingLayout({ children, banner, infinite_scroller, styled }: LandingLayoutProps) {
    const {hidePopup} = usePopup()
    const popup = <CreateGeneralAppointment />
    return (
        <div className="relative min-h-screen flex flex-col">
            <div className="">
                <div className=""> {/*  fixed top-0 left-0 w-full z-10 */}
                    <Navigation />
                </div>
            </div>

            <div className="lex-1 overflow-y-auto">
                {infinite_scroller && <div className="md:py-2">
                    <InfiniteScroller styled={styled} items={infinite_scroller} />
                </div>}
                {banner && <div className="relative w-full p-8 sm:p-16 lg:p-24">
                    <div className="absolute inset-0 -z-10 left-0 right-0 w-full">
                        <img
                            className="w-full h-full object-cover inset-0"
                            src="images/black_pattern.jpg"
                            alt="Navigation background"
                        />
                    </div>
                    <div className="bg-white text-center p-4 sm:p-6 lg:p-12 md:mx-24 lg:mx-36 rounded-lg z-20 backdrop-blur-md">
                        <h3 className="text-center text-xl md:text-3xl lg:text-5xl font-bold sm:font-bold font-bangers xl:text-7xl">{banner}</h3>
                    </div>
                </div>}
                <div className="w-full max-w-[1460px] mih-h-[80vh] mx-auto pt-2 md:pt-4 xl:pt-[2rem] thin-scrollbar">
                    {hidePopup.show && hidePopup.data?.page === "appointments" && popup}
                    {children}
                </div>
            </div>

            <div className="mt-auto hidden">
                <LandingFooter />
            </div>
        </div>
    );
}
