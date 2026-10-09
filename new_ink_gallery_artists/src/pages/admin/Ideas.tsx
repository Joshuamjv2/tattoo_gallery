import Layout from "../../layouts/AdminLayout";
import { usePopup } from "../../context/hooks/usePopUp";
import AddTattooIdea from "./components/Ideas/AddIdea";
import AllAdminTattooIdeas from "./components/Ideas/Ideas";

export default function AdminTattooIdeas(){
    const {hidePopup, handleHidePopup} = usePopup()
    const handlePopup = () => handleHidePopup({show: true, type: "create"})
    const popup = <div><AddTattooIdea /></div>
    return (
        <div>
            {hidePopup.show && hidePopup.type === "create" && popup}
            <Layout cta="Upload Idea" handleCta={handlePopup}>
                {/* <div>View, Edit and Add your designs here!</div> */}
                <div className="bg-white">
                    <AllAdminTattooIdeas />
                </div>
            </Layout>
        </div>
    )
}