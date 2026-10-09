import DesignNav from "../../../landing/Designs/components/Nav"
import Categories from "../../../landing/Designs/components/Categories"
import SingleDesign from "../../../landing/Designs/components/SingleDesign"
import { usePopup } from "../../../../context/hooks/usePopUp"
import { useState } from "react"
import { useApiGet } from "../../../../context/hooks/query"
import { get_designs } from "../../../../api/designs"
import { Design } from "../../../../types/Design"
import AddDesign from "./AddDesigns"
import LoadingModal from "../../../../components/common/Loading"
import { useFilterSort } from "../../../../utils/hooks/search_and_sort"

export default function DesignsAdmin(){
    const {hidePopup, handleHidePopup} = usePopup()
    const [selected_design, setSelectedDesign] = useState(null)

    const {
        data: designs,
        isLoading,
        isFetched
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

    const popup = selected_design && <AddDesign />
    const handle_design_click = (design) => {
        if (design !== null){
            setSelectedDesign(design)
            handleHidePopup({show: true, data: design, confirmModel: false, type: "edit"})
        }
    }

    if (isLoading){
        return <LoadingModal />
    }

    return (
        isFetched && <div className="">
            {hidePopup.show && hidePopup.type === "edit" && popup}
                <div className="relative">
                    {/* Fixed navigation section */}
                    <div className="sticky top-0 bg-white z-10 pt-4 pb-4 md:pb-6 sm:border-b">
                        <DesignNav
                                                    searchQuery={searchQuery}
                                                    onSearchChange={setSearchQuery}
                                                    sortBy={sortBy}
                                                    onSortChange={setSortBy}
                                                    sortOrder={sortOrder}
                                                    onOrderChange={setSortOrder}
                                                />
                        {/* <div className="border mt-4 lg:mt-6 border-black/20 h-[.5px]"></div> */}
                    </div>
                    {/* Content area */}
                    <div className="flex gap-6 lg:gap-24 mt-4">
                        {/* Categories - will scroll with page */}
                        <Categories />
                        {/* Scrollable design items container */}
                        <div className="no-scrollbar w-full overflow-y-auto px-6 md:px-0" style={{ maxHeight: 'calc(100vh - 250px)' }}>
                            <div className="grid gap-8 grid-cols-2 justify-center items-center sm:grid-cols-3 lg:grid-cols-4 pb-8">
                                {filteredData.map((design: Design, i: number) => <div key={i}>
                                    <div onClick={()=>handle_design_click(design)}>
                                        <SingleDesign imageLocation={design.images ? design.images[0]: undefined} name={design.name} price={design.price}/>
                                    </div>
                                </div>)}
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    )
}