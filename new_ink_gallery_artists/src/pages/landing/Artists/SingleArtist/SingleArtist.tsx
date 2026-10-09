import { useState } from "react";
import LandingLayout from "../../../../layouts/LandingLayOut"
import { BsInstagram } from "react-icons/bs";
import { FaPenFancy, FaRegImages, FaRegHeart, FaShareNodes, FaBell, FaRegBell } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import { useApiGet } from "../../../../utils/hooks/query";
import { get_artist } from "../../../../api/artists";
import LoadingModal from "../../../../components/common/Loading";
import { get_artist_work } from "../../../../api/portfolio";
import { Portfolio } from "../../../../types/Portfolio";
import CreateArtistAppointment from "../components/CreateAppointment";
import { usePopup } from "../../../../context/hooks/usePopUp";


export default function SingleArtistPage(){
    const {hidePopup, handleHidePopup} = usePopup()
    const { id } = useParams();
    const [notifyMe, setNotifyMe] = useState(false);

    const {data, isFetching: fetchingArtist, isFetched} = useApiGet([id, id], ()=>get_artist(id ? id: ""))
    const {
        data: work_data, isLoading: work_loading,
        isFetched: work_fetched} = useApiGet([id + "work", id], ()=>get_artist_work(id ? id: ""))

    if (fetchingArtist){
        return <LoadingModal />
    }

    const popup = <div><CreateArtistAppointment /></div>
    return (
        isFetched && <div>
            {(hidePopup.show && !hidePopup.data?.page) && popup}
            <LandingLayout>
                <div className="px-2 pb-2 xl:pb-10">
                    <div className="flex gap-24 xl:gap-36 py-6 justify-center items-center px-6 md:px-12 relative">
                        {/* Circular image with centered text */}
                        <div className="flex p-4">
                            <div className="relative w-[320px] h-[320px] lg:w-[450px] md:h-[400px] md:w-[400px] lg:h-[450px] rounded-full overflow-hidden border-gray-200 flex items-center justify-center px-2 sm:px-0">
                                <img
                                    className="absolute w-full h-full object-cover animate-spin-slow z-10"
                                    src="/images/black_pattern.jpg"
                                    alt="Navigation background"
                                />
                                <div onClick={()=>handleHidePopup({show: true, type: "create", data: data})} className="absolute inset-0 bg-white m-4 md:m-8 p-4 md:p-8 flex flex-col items-center justify-center rounded-full text-center z-20 cursor-pointer">
                                    <div className="border hover:scale-105 hover:duration-300 p-1 rounded-full border-black bg-black relative hidden md:block">
                                        <div className="bg-black">
                                            <FaPenFancy className="w-4 h-4" color="white" />
                                        </div>
                                    </div>
                                    <h2 className="text-black text-2xl sm:text-3xl md:text-4xl font-extrabold hover:scale-105 hover:duration-300 font-bangers sm:my-2 uppercase">Book {data.name}</h2>
                                    <p className="font-geo text-sm py-2">{data.description}</p>
                                    <a href={`https://instagram.com/${data.instagram}`}>
                                        <div className="flex gap-1 items-center md:mt-2 font-roboto font-bold text-sm sm:text-lg">
                                            <BsInstagram color="black" />
                                            <p className="font-semibold text-sm sm:text-base italic font-bangers underline uppercase">{data.instagram}</p>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* artist info */}
                        <div className="hidden lg:block aspect-[3/4] object-cover transition-transform duration-500 ">
                            <img src={data.image ? data.image: "" } className="rounded-md w-[380px] h-full object-cover filter grayscale hover:grayscale-0 transition-all" />
                        </div>
                    </div>

                    {/* main content */}
                    <div className={`mt-4 ${work_data && work_data.length > 0 && ""}`}>

                        {/* profile nav */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center w-full mb-2">
                            <div className="flex w-full sm:w-auto">
                                <a href="#work" className="flex-1 sm:flex-none flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 sm:px-10 py-4 border-b-1 border-black -mb-[2px] transition-all">
                                    <FaRegImages className="w-5 h-5" />
                                    <span className="font-bangers text-base sm:text-lg uppercase tracking-wide hidden">Work</span>
                                    <span className="sm:inline-flex items-center justify-center text-[11px] font-roboto font-bold bg-black text-white rounded-full min-w-[20px] h-5 px-1 hidden sm:hidden">
                                        {work_data ? work_data.length : 0}
                                    </span>
                                </a>
                                <div className="flex-1 sm:flex-none flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-4 sm:px-10 py-4 border-b-1 border-transparent text-black/30 cursor-default select-none">
                                    <FaRegHeart className="w-5 h-5" />
                                    <span className="font-bangers text-base sm:text-lg uppercase hidden">Favorites</span>
                                </div>
                                <div className="flex-1 sm:flex-none flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-4 sm:px-10 py-4 border-b-1 border-transparent text-black/30 cursor-default select-none">
                                    <FaShareNodes className="w-5 h-5" />
                                    <span className="font-bangers text-base sm:text-lg uppercase hidden">Share Profile</span>
                                </div>
                                <button
                                    onClick={() => setNotifyMe(!notifyMe)}
                                    className={`flex-1 sm:flex-none flex px-4 sm:px-10 flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2   py-4 border-b-1 -mb-[2px] transition-all ${
                                        notifyMe ? "border-black" : "border-transparent"
                                    }`}
                                >
                                    {notifyMe
                                        ? <FaBell className="w-5 h-5 text-orange-500" />
                                        : <FaRegBell className="w-5 h-5" />
                                    }
                                    <span className={`font-bangers text-base sm:text-lg uppercase hidden ${notifyMe ? "text-orange-500" : ""}`}>
                                        {notifyMe ? "Subscribed" : "Notify me"}
                                    </span>
                                </button>
                            </div>
                        </div>

                        <div id="work" className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                            {work_data && work_data.map((work: Portfolio) => <div key={work.id}>
                                <img src={work.image} width={650} alt="" className="filter grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer" />
                            </div>)}
                        </div>
                    </div>
                </div>
            </LandingLayout>
        </div>
    )
}
