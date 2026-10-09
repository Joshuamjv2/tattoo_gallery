import Layout from "../../../../layouts/AdminLayout";
import { useParams } from "react-router-dom";
import { useApiGet } from "../../../../utils/hooks/query";
import { get_artist } from "../../../../api/artists";
import LoadingModal from "../../../../components/common/Loading";
import AllArtistWorks from "../Work/AllWork";
import { BiTrash } from "react-icons/bi";
import { BiPencil } from "react-icons/bi";
import { useState } from "react";
import AddArtist from "../../components/Artists/AddArtist";
import { usePopup } from "../../../../context/hooks/usePopUp";
import { delete_artist } from "../../../../api/artists";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import ArtistAppointments from "../Appointments/ArtistAppointments";

export default function SingleArtistPage(){
    const {handleHidePopup, hidePopup} = usePopup()
    const { id } = useParams();
    const [rendered, setRendered] = useState({name: "work", ui: <AllArtistWorks artist_id={id} />})
    const navigate = useNavigate()

    const {data, isLoading, isFetched} = useApiGet(["artist", id], ()=>get_artist(id ? id: ""))
    const queryClient = useQueryClient()

    const popup = <div>
        <AddArtist />
    </div>

    const handle_delete_artist = async () => {
        await delete_artist(id).then(()=>{
            queryClient.invalidateQueries({queryKey: [id]}).then(()=>{
                navigate("/admin/artists")
            })
        })
    }


    const navigation = [
        {name: "work", ui: <AllArtistWorks artist_id={id} />},
        {name: "appointments", ui: <ArtistAppointments artist_id={id} />}
    ]

    // <ArtistAppointments artist_id={id} />

    if (isLoading){
        return <LoadingModal />
    }

    return (
        isFetched && <div>
            {hidePopup.show && hidePopup.modal =="artist" && popup}
            <Layout>
                <div className="no-scrollbar h-[100vh] md:h-[100vh] no-scrollbar overflow-y-scroll">
                    <div className="border-b pb-4">
                        <div className="flex justify-between px-4 flex-col lg:flex-row lg:items-end">
                            <div className="mt-4 flex items-end gap-4">
                                <div className="w-[150px] h-[150px] rounded-full overflow-hidden">
                                    <img className="w-full h-full object-cover" src={data.image} alt={data.name + "'s photo"}/>
                                </div>
                                <div className="mb-4">
                                    <h3 className="font-semibold text-[1.5rem] md:text-2xl lg:text-3xl">{data.name}</h3>
                                    <a
                                        href={`https://instagram.com/${data.instagram}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="transition-colors mb-2 font-semibold"
                                        >
                                        @{data.instagram}
                                    </a>
                                </div>
                            </div>
                            <div className="">
                                <ul className="flex gap-2 mt-6 justify-start sm:justify-end">
                                    {/* <div></div> */}
                                    {/* <div className="flex gap-2 items-center"> */}
                                        {navigation.map(item => <li onClick={()=>setRendered(item)} className={`capitalize rounded border text-sx sm:text-base px-2 py-2 sm:px-4 cursor-pointer ${item.name == rendered.name && "text-white bg-black"}`} key={item.name}>{item.name}</li>)}
                                        {/* <li className="rounded bg-black text-sx sm:text-base text-white px-2 py-2 sm:px-4 cursor-pointer">Work</li>
                                        <li className="rounded border text-sx sm:text-base px-2 py-2 sm:px-4 cursor-pointer">Appointments</li> */}
                                    {/* </div> */}
                                    <div className="flex gap-2 ml-4">
                                        <li onClick={handle_delete_artist} className="rounded border px-2 py-2 sm:px-4 text-center flex justify-center items-center bg-red-500 text-white cursor-pointer"><BiTrash /></li>
                                        <li onClick={()=>handleHidePopup({type: "edit", show: true, data: data, modal: "artist"})} className="rounded border px-2 py-2 sm:px-4 text-center flex justify-center items-center bg-blue-500 text-white cursor-pointer"><BiPencil /></li>
                                    </div>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="p-4">
                        {rendered.ui}
                    </div>
                </div>
            </Layout>

        </div>
    )
}
