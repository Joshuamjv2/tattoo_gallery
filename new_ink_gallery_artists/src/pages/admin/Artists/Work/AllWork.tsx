import AddArtistWork from "./components/AddWork"
import { usePopup } from "../../../../context/hooks/usePopUp"
import { get_artist_work } from "../../../../api/portfolio"
import { useApiGet } from "../../../../context/hooks/query"
import LoadingModal from "../../../../components/common/Loading"
import { Portfolio } from "../../../../types/Portfolio"
import { BiPlus } from "react-icons/bi"
import { QueryClient } from "@tanstack/react-query"


export default function AllArtistWorks({artist_id}: {artist_id?: string}){
    const {hidePopup, handleHidePopup} = usePopup()
    const popup = <div><AddArtistWork artist_id={artist_id} /></div>
    const {data, isLoading, isFetched} = useApiGet([artist_id + "work", artist_id], ()=>get_artist_work(artist_id ? artist_id: ""))


    if (isLoading){
        return <LoadingModal />
    }

    return (
    <div className="">
        {hidePopup.show && hidePopup.modal == "artist_work" && popup}
        <div>
            <button className="fixed bottom-4 md:bottom-8 md:right-8 right-4" onClick={()=>handleHidePopup({type: "create", show: true, modal: "artist_work"})}><BiPlus className="size-10 bg-black rounded-full" color="white" /></button>
        </div>
        {isFetched && <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {data.map((work: Portfolio) => {
                return <div className="cursor-pointer" onClick={()=>handleHidePopup({type: "edit", show: true, data: work, modal: "artist_work"})} key={work.id}>
                    <img width={400} src={work.image} alt={work.id} />
                </div>
            })}
        </div>}
    </div>)
}