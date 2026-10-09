import LandingLayout from "../../../../layouts/LandingLayOut"
import { BsInstagram } from "react-icons/bs";
import { FaPenFancy } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import { useApiGet } from "../../../../utils/hooks/query";
import { get_artist } from "../../../../api/artists";
import LoadingModal from "../../../../components/common/Loading";
import { get_artist_work } from "../../../../api/portfolio";
import { Portfolio } from "../../../../types/Portfolio";


export default function SingleArtistPage(){
    const { id } = useParams();

    const {data, isFetching: fetchingArtist, isFetched} = useApiGet([id, id], ()=>get_artist(id ? id: ""))
    const {data: work_data, isLoading: work_loading, isFetched: work_fetched} = useApiGet([id + "work", id], ()=>get_artist_work(id ? id: ""))

    if (fetchingArtist){
        return <LoadingModal />
    }
    return (
        isFetched && <div>
            <LandingLayout>
                <div>
                    <div className="flex gap-36 py-6 justify-center items-center px-6 md:px-12 relative">
                        {/* Circular image with centered text */}
                        <div className="flex">
                            <div className="relative w-[300px] h-[300px] lg:w-[450px] md:h-[400px] md:w-[400px] lg:h-[450px] rounded-full overflow-hidden border-gray-200 flex items-center justify-center">
                                <img
                                    className="absolute w-full h-full object-cover animate-spin-slow z-10"
                                    src="/images/black_pattern.jpg"
                                    alt="Navigation background"
                                />
                                <div className="absolute inset-0 bg-white m-4 md:m-8 p-4 md:p-8 flex flex-col items-center justify-center rounded-full text-center z-20">
                                    <div className="border p-1 rounded-full border-black bg-black relative">
                                        <div className="bg-black">
                                            <FaPenFancy className="w-4 h-4" color="white" />
                                        </div>
                                    </div>
                                    <h2 className="text-black text-2xl md:text-3xl font-extrabold md:mb-4">{data.name}'s Work</h2>
                                    <p className="hidden md:block">{data.description}</p>
                                    <a href={`https://instagram.com/${data.instagram}`}>
                                        <div className="flex gap-1 items-center md:mt-2">
                                            <BsInstagram color="black" />
                                            <p className="font-semibold italic">{data.instagram}</p>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* artist info */}
                        <div className="hidden lg:block aspect-[3/4] object-cover transition-transform duration-500">
                            <img src={data.image ? data.image: "" } className="rounded-md w-[380px] h-full object-cover" />
                        </div>
                    </div>

                    {/* main content */}
                    <div className={`mt-8 ${work_data && work_data.length > 0 && "lg:border-t"} lg:pt-4`}>
                        <div className="flex hidden">
                            <h3 className="font-bold text-3xl text-center bg-black text-white p-2 uppercase">Previous works</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                            {work_data && work_data.map((work: Portfolio) => <div key={work.id}>
                                <img src={work.image} width={450} alt="" className="filter grayscale hover:scale-105 hover:grayscale-0 transition-all duration-300 cursor-pointer" />
                            </div>)}
                        </div>
                    </div>
                </div>
            </LandingLayout>
        </div>
    )
}
