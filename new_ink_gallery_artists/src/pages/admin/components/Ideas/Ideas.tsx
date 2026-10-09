import SingleIdea from "./SingleIdea"
import { usePopup } from "../../../../context/hooks/usePopUp"
import { useState } from "react"
import { useApiGet } from "../../../../context/hooks/query"
import { get_ideas } from "../../../../api/tattoo_ideas"
import { TattooIdea } from "../../../../types/TattooIdea"
import LoadingModal from "../../../../components/common/Loading"
import AddMultipleIdeas from "./AddIdea"


export default function AllAdminTattooIdeas(){
    const {hidePopup, handleHidePopup} = usePopup()
    const [selected_idea, setSelectedIdea] = useState(null)

    // this is where I wanna use it
    const popup = selected_idea && <AddMultipleIdeas />
    const handle_idea_click = (idea) => {
        if (idea !== null){
            setSelectedIdea(idea)
            handleHidePopup({show: true, data: idea, confirmModel: false, type: "edit"})
        }
    }

    const {
            data: ideas,
            isLoading,
            isFetched
        } = useApiGet(["tattoo_ideas"], get_ideas);

    if (isLoading){
        return <LoadingModal />
    }

    return (
        isFetched && <div className="">
            {hidePopup.show && hidePopup.type === "edit" && popup}
                <div className="relative">
                    {/* Content area */}
                    <div className="flex gap-6 lg:gap-24">
                        {/* Scrollable design items container */}
                        <div className="no-scrollbar w-full overflow-y-auto px-4 md:px-4 md:mt-4" style={{ maxHeight: 'calc(100vh - 100px)' }}>
                            <div className="grid gap-8 grid-cols-2 justify-center items-center sm:grid-cols-3 lg:grid-cols-4 pb-8">
                                {ideas.map((idea: TattooIdea, i: number) => <div key={i}>
                                    <div className="" onClick={()=>handle_idea_click(idea)}>
                                    <div className="w-full aspect-[3/4] overflow-hidden">
                                        <img
                                        src={idea.image}
                                        alt=""
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 group-hover:grayscale-0 grayscale cursor-pointer"
                                        />
                                    </div>
                                    {/* <img src={idea.image} width={450} alt="" className="transition-all duration-300 cursor-pointer" /> */}
                                    </div>
                                </div>)}
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    )
}
