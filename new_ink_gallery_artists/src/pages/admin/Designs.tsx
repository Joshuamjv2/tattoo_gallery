import Layout from "../../layouts/AdminLayout";
import DesignsAdmin from "./components/Designs/AllDesigns";
import { usePopup } from "../../context/hooks/usePopUp";
import AddDesign from "./components/Designs/AddDesigns";

export default function AdminDesigns(){
    const {hidePopup, handleHidePopup} = usePopup()
    const handlePopup = () => handleHidePopup({show: true, type: "create"})
    const popup = <div><AddDesign /></div>
    return (
        <div>
            {hidePopup.show && hidePopup.type === "create" && popup}
            <Layout cta="Create Design" handleCta={handlePopup}>
                {/* <div>View, Edit and Add your designs here!</div> */}
                <div className="mt-4 bg-white px-4">
                    <DesignsAdmin />
                </div>
            </Layout>
        </div>
    )
}