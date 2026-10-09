import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { BiSearch } from "react-icons/bi";
import { SortOrder } from "../../../../utils/hooks/search_and_sort";


interface Props {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    sortBy: string | null; // Or a specific keyof Design if you want to type it strictly
    onSortChange: (field: string | null) => void;
    sortOrder: SortOrder;
    onOrderChange: (order: SortOrder) => void;
    selectedPriceRange: string | null;
    onPriceRangeChange: (range: string | null) => void;
}

export default function DesignNav({
        searchQuery,
        onSearchChange,
        sortBy,
        onSortChange,
        sortOrder,
        selectedPriceRange,
        onPriceRangeChange,
        onOrderChange
    }: Props){
    return (
    <div className="w-full flex-col-reverse flex sm:flex-row sm:justify-between gap-2 sm:gap-4 mx-auto mt-4 sm:mt-0">
        <div className="">
            {/* filter for small screens */}
            <div className="md:px-4 hidden">
                <div className="flex gap-2 md:hidden items-center border rounded-2xl border-black/20 py-1 sm:px-4">
                    <h4 className="tex-xs">Filter</h4>
                    <div><HiOutlineAdjustmentsHorizontal /></div>
                </div>
                <div className="hidden mt-2 justify-between">
                    <h3><span className="text-black/50 mr-2">Showing:</span> All</h3>
                </div>
            </div>

            {/* filter for large screens */}
            <div className="flex flex-col gap-2 sm:px-4 2xl:px-0">
                {/* <h3 className="font-semibold text-xl hidden md:block">Search</h3> */}
                {/* Search input - above background */}
                <div className="flex relative z-10 gap-2 items-center border-1 border-black/20 text-black px-4 sm:rounded-3xl md:min-w-[12rem] border-b sm:border">
                    <div className="flex items-center gap-1 pb-2 sm:pb-0">
                        <div className="hidden sm:block py-1 md:py-2">
                            <BiSearch />
                        </div>

                        <input
                            type="text"
                            className="bg-transparent outline-none focus:outline-none py-1  md:py-2 placeholder:text-black/70 placeholder:text-base font-geo sm:placeholder:text-base"
                            placeholder="Search flash designs..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>
                </div>
            </div>

        </div>
        <div>
            <div className="flex gap-2 flex-col sm:px-4 2xl:px-0 -mt-4 sm:-mt-0">
                <h3 className="font-semibold md:text-xl text-sm hidden">Sort</h3>
                <div className=" sm:border-black/20 sm:border sm:rounded-3xl px-2 py-1 md:py-2">
                <select
                    className="bg-transparent font-geo cursor-pointer outline-none hover:outline-none text-base md:text-base"
                    value={
                        sortBy === "price" && sortOrder === "asc"
                        ? "price_asc"
                        : sortBy === "price" && sortOrder === "desc"
                        ? "price_desc"
                        : sortBy === "created_at" && sortOrder === "asc"
                        ? "created_at_asc"
                        : sortBy === "created_at" && sortOrder === "desc"
                        ? "created_at"
                        : ""
                    }
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value === "") {
                        onSortChange(null);
                        onOrderChange("desc");
                        } else if (value === "price_asc") {
                        onSortChange("price");
                        onOrderChange("asc");
                        } else if (value === "price_desc") {
                        onSortChange("price");
                        onOrderChange("desc");
                        } else if (value === "created_at") {
                        onSortChange("created_at");
                        onOrderChange("desc");
                        } else if (value === "created_at_asc") {
                        onSortChange("created_at");
                        onOrderChange("asc");
                        }
                    }}
                    >
                    <option value="created_at">Newest to Oldest</option>
                    <option value="created_at_asc">Oldest to Newest</option>
                    <option value="price_desc">Price - High to Low</option>
                    <option value="price_asc">Price - Low to High</option>
                </select>
                </div>
            </div>
            <div className="mt-1 hidden">
                {/* inactivate if no filter or sort is applied */}
                <h4 className="text-right md:hidden px-4">Reset</h4>
            </div>
        </div>
    </div>)
}