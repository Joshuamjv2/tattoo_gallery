import Layout from "../../../layouts/AdminLayout";
import ArtistsAdmin from "../components/Artists/AllArtists";
import { usePopup } from "../../../context/hooks/usePopUp";
import AddArtist from "../components/Artists/AddArtist";
import { get_artists } from "../../../api/artists";
import { useApiGet } from "../../../context/hooks/query";
import { Outlet } from "react-router-dom";
import LoadingModal from "../../../components/common/Loading";
import { useState } from "react";

export default function AdminArtists(){
    const {hidePopup, handleHidePopup} = usePopup()
    // const [firstRender, setFirstRender] = useState(true)

    const {
        data,
        isLoading,
        isFetching,
        isFetched
        } = useApiGet(["artists"], get_artists);

        // && firstRender (add this to the if statement)
    if ((isLoading || isFetching)){
        // setFirstRender(false)
        return <LoadingModal />
    }

    const handlePopup = () => handleHidePopup({show: !hidePopup.show, type: "create"})
    const popup = <div><AddArtist /></div>
    return (
        isFetched && <div>
            <Layout cta="Add artist" handleCta={handlePopup}>
                <div>
                    {hidePopup.show && popup}
                    <ArtistsAdmin artists={data} />
                </div>
            </Layout>
            <Outlet />
        </div>
    )
}