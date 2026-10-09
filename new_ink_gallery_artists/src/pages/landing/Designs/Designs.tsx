import LandingLayout from "../../../layouts/LandingLayOut"
import DesignNav from "./components/Nav"
import Categories from "./components/Categories"
import SingleDesign from "./components/SingleDesign"
import CreateAppointment from "./components/CreateAppointement"
import { usePopup } from "../../../context/hooks/usePopUp"
import { useState } from "react"
import { useApiGet } from "../../../context/hooks/query"
import { get_designs } from "../../../api/designs"
import { get_tags } from "../../../api/tags"
import LoadingModal from "../../../components/common/Loading"
import { useFilterSort } from "../../../utils/hooks/search_and_sort"

export default function DesignsPage(){
    const {hidePopup, handleHidePopup} = usePopup()
    const [selected_design, setSelectedDesign] = useState(null)

    const {
        data: designs,
        isLoading,
        isFetching,
    } = useApiGet(["designs"], get_designs);

    const {
        filteredData,
        searchQuery,
        setSearchQuery,
        selectedTags,
        setSelectedTags,
        sortBy,
        setSortBy,
        sortOrder,
        setSortOrder,
    } = useFilterSort({
        data: designs ?? [],
        searchableFields: ["name", "description", "price"], // Assuming 'name' is searchable
        filterByTags: (design, selectedTags) => {
            const designTags: Tag[] = design.tags ?? [];
            return selectedTags.some(selected =>
                designTags.some(tag => tag.id === selected.id)
            );
        },
        customFilter: (design) => {
            if (!selectedPriceRange) return true;
            const price = design.price;
            switch (selectedPriceRange) {
                case "100-200": return price >= 100 && price <= 200;
                case "200-300": return price >= 200 && price <= 300;
                case "300-400": return price >= 300 && price <= 400;
                case "400+": return price >= 400;
                default: return true;
            }
        }
    });

    const popup = (selected_design && <CreateAppointment selected_design={selected_design} />)
    const handle_design_click = (design: any) => {
        console.log("Design clicked:", design);
        // so we need to ensure that all the design images' links replace "ink-gallery-images" with "256_data_bucket"
        design.images = design.images.map((image: string) => image.replace("ink-gallery-images", "256_data_bucket"));
        setSelectedDesign(design)
        handleHidePopup({show: true, data: selected_design, confirmModel: false, type: "create"})
    }


    const {data: tags, isLoading: loading_tags, isFetching: fetching_tags} = useApiGet(["tags"], get_tags)

    const design_tags = tags ? tags.map(tag => <div className={`${selectedTags.some(t => t.id === tag.id) && "bg-black text-white"} relative mx-2 md:mx-4 px-6 py-2 text-sm md:text-base border border-black/20 rounded-full shadow text-center ${selectedTags.some(t => t.id !== tag.id) && ""} cursor-pointer transition-colors duration-200`} onClick={()=>{
        setSelectedTags(prev =>
            prev.some(a => a.id === tag.id)
                ? prev.filter(a => a.id !== tag.id)
                : [...prev, tag]
            );
    }}>{"# "+tag.tag}</div>): []

    if (isLoading || loading_tags || isFetching || fetching_tags){
        return <LoadingModal />
    }
    return (
        designs && tags && <div className="">
            {(hidePopup.show && !hidePopup.data?.page) && popup}
            <LandingLayout styled={true} infinite_scroller={design_tags} banner={"Browse Flash Designs"}>
                <div className="relative">
                    {/* Fixed navigation section */}
                    <div className="sticky top-0 z-10 sm:pt-2 xl:pt-4">
                        <div>
                                <div className="">
                                    {/* this is the component accommodating the sort, search and filter UIs */}
                                    <DesignNav
                                        searchQuery={searchQuery}
                                        onSearchChange={setSearchQuery}
                                        sortBy={sortBy}
                                        onSortChange={setSortBy}
                                        sortOrder={sortOrder}
                                        onOrderChange={setSortOrder}
                                    />
                                    {filteredData && filteredData.length > 0 && <div className="hidden sm:block border-t mt-4 lg:mt-6 border-black/20 mx-w-[2000px]"></div>}
                                </div>
                            </div>
                    </div>

                    {/* Content area */}
                    <div className="flex gap-6 lg:gap-24 xl:gap-28">
                        {/* Categories - will scroll with page. These are that tags we intend to filter with so the filter hook might apply there as well */}
                        {tags && <Categories selectedTags={selectedTags} tags={tags} onTagToggle={(tag) => {
                            setSelectedTags(prev =>
                            prev.some(t => t.id === tag.id)
                                ? prev.filter(t => t.id !== tag.id)
                                : [...prev, tag]
                            );
                        }} />}


                        {/* Scrollable design items container. These are the designs we should sort and filter */}
                        <div id="designs" className="no-scrollbar w-full overflow-y-auto pt-4 px-4 md:px-6" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                            <div className="grid gap-12 grid-cols-[repeat(auto-fit,minmax(120px,1fr))] sm:grid-cols-[repeat(auto-fit,minmax(180px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(250px,1fr))] pb-4">
                                {filteredData.map((design, i) => <div key={i}>
                                    <div onClick={()=>handle_design_click(design)}>
                                        <SingleDesign imageLocation={design.images[0]} name={design.name} price={design.price}/>
                                    </div>
                                </div>)}
                            </div>
                        </div>
                    </div>
                </div>
            </LandingLayout>
        </div>
    )
}