import LandingLayout from "../../../layouts/LandingLayOut"
import { useApiGet } from "../../../context/hooks/query";
import { get_ideas } from "../../../api/tattoo_ideas";
import { get_tags } from "../../../api/tags";
import { TattooIdea } from "../../../types/TattooIdea";
import { Tag } from "../../../types/Tag";
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import LoadingModal from "../../../components/common/Loading";
import CreateIdeaAppointment from "./CreateAppointment";
import { usePopup } from "../../../context/hooks/usePopUp";
import { useFilterSort } from "../../../utils/hooks/search_and_sort";
import TattooIdeaNav from "./Nav";


export default function IdeasPage(){
    const {handleHidePopup, hidePopup} = usePopup()
    const [ideas, setIdeas] = useState<TattooIdea[]>([])
    const [tags, setTags] = useState<Tag[]>([])
    const [selected_idea, setSelectedIdea] = useState(undefined)


    const {
        data,
        isLoading,
        isFetching,
        isFetched
    } = useApiGet(["tattoo_ideas"], get_ideas);

    const {
            filteredData,
            selectedTags,
            setSelectedTags,
            setSearchQuery,
            searchQuery,
            onSearchChange,
            setSortBy,
            setSortOrder,
            sortBy,
            sortOrder
        } = useFilterSort({
            searchableFields: ["name", "description", "tags"],
            data: ideas ?? [],
            filterByTags: (idea, selectedTags) => {
                const ideaTags: Tag[] = idea.tags ?? [];
                return selectedTags.some(selected =>
                    ideaTags.some(tag => tag.id === selected.id)
                );
            },
        });

    const {
        data: tags_data,
        isLoading: loadingTags,
        isFetched: fetchedTags
    } = useApiGet(["tags"], get_tags)

    useEffect(() => {
        if (isFetched && data) {
            setIdeas(data)
        }

        if (fetchedTags){
            setTags(tags_data)
        }
    }, [isFetched, data, fetchedTags])

    if (isLoading || isFetching || loadingTags){
        return <LoadingModal />
    }

    const popup = <div><CreateIdeaAppointment /></div>

    const ideaTags = tags ? tags.map(tag => <div className={`${selectedTags.some(t => t.id === tag.id) && "bg-black text-white"} relative mx-2 md:mx-4 px-6 py-2 text-sm md:text-base border border-black/20 rounded-full shadow text-center ${selectedTags.some(t => t.id !== tag.id) && ""} cursor-pointer transition-colors duration-200`} onClick={()=>{
        setSelectedTags(prev =>
            prev.some(a => a.id === tag.id)
                ? prev.filter(a => a.id !== tag.id)
                : [...prev, tag]
            );
    }}>{"# "+tag.tag}</div>): []

    return (
        <div className="">
            {(hidePopup.show && !hidePopup.data?.page) && popup}
            <LandingLayout styled={true} infinite_scroller={ideaTags} banner={"Tattoo Inspo"}>
                <div className="relative">
                    <div className="sticky top-0 z-10">
                        <div>
                            <div className="">
                                <TattooIdeaNav
                                    searchQuery={searchQuery}
                                    onSearchChange={setSearchQuery}
                                    sortBy={sortBy}
                                    onSortChange={setSortBy}
                                    sortOrder={sortOrder}
                                    onOrderChange={setSortOrder}
                                />
                                {filteredData && filteredData.length > 0 && <div className="hidden sm:block mt-4 mx-w-[2000px]"></div>}
                            </div>
                        </div>
                    </div>

                    <div id="designs" className="no-scrollbar w-full overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                        <div className="grid gap-2 sm:gap-4 grid-cols-[repeat(auto-fit,minmax(120px,1fr))] sm:grid-cols-[repeat(auto-fit,minmax(180px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(250px,1fr))] pb-2 sm:pb-4  px-2 sm:px-4">
                        {filteredData.map((idea: TattooIdea) => (
                            <div
                                key={idea.id}
                                onClick={() => handleHidePopup({ show: true, type: "create", data: idea })} className="cursor-pointer group"
                            >
                            <div className="w-full aspect-[3/4] overflow-hidden">
                                <img
                                src={idea.image}
                                alt=""
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 group-hover:grayscale-0 grayscale"
                                // grayscale
                                />
                            </div>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
            </LandingLayout>
            <Outlet />
        </div>
    )
}
