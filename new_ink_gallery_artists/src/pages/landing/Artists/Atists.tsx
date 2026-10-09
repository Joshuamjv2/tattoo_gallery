import LandingLayout from "../../../layouts/LandingLayOut";
import Artist from "./components/Artist";
import { useApiGet } from "../../../context/hooks/query";
import { get_artists } from "../../../api/artists";
import { useState, useEffect, useMemo } from "react";
import { Artist as ArtistType } from "../../../types/Artist";
import { Outlet } from "react-router-dom";
import LoadingModal from "../../../components/common/Loading";
import { usePopup } from "../../../context/hooks/usePopUp";
import ArtistNav from "./Nav";
import { Tag } from "../../../types/Tag";
import { useFilterSort } from "../../../utils/hooks/search_and_sort";

export default function ArtistsPage() {
    const [artists, setArtists] = useState<ArtistType[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);

    const {
        data,
        isLoading,
        isFetching,
        isFetched
    } = useApiGet(["artists"], get_artists);

    // Transform artists to include searchable text
    const artistsWithSearchText = useMemo(() => {
        return artists.map((artist) => {
            const workTags =
                artist.work?.flatMap(
                    (workItem) =>
                        workItem.tags?.map((tag) =>
                            typeof tag === "string" ? tag : tag.tag
                        ) || []
                ) || [];

            return {
                ...artist,
                searchText: [artist.name, ...workTags].join(" ").toLowerCase(),
            };
        });
    }, [artists]);

    const {
        filteredData,
        selectedTags,
        setSelectedTags,
        setSearchQuery,
        searchQuery,
        setSortBy,
        setSortOrder,
        sortBy,
        sortOrder,
        selectedPriceRange,
        setSelectedPriceRange,
    } = useFilterSort({
        data: artistsWithSearchText,
        searchableFields: ["searchText"],
        filterByTags: (artist, selectedTags) => {
            const workTags =
                artist.work?.flatMap(
                    (w) =>
                        w.tags?.map((tag) =>
                            typeof tag === "string" ? tag : tag.tag
                        ) || []
                ) || [];

            return selectedTags.some((tag) => workTags.includes(tag.tag));
        },
    });

    // Oldest first, newest last
    const sortedFilteredData = useMemo(
        () =>
            [...filteredData].sort(
                (a, b) =>
                    new Date(a.created_at).getTime() -
                    new Date(b.created_at).getTime()
            ),
        [filteredData]
    );

    useEffect(() => {
        if (isFetched && data) {
            setArtists(data);
        }
    }, [isFetched, data]);

    const { hidePopup } = usePopup();

    if (isLoading || isFetching) {
        return <LoadingModal />;
    }

    const artist_names = artists.map((artist) => (
        <a key={artist.id} href={`/${artist.id}`}>
            <p>@{artist.instagram}</p>
        </a>
    ));

    return (
        <div>
            <LandingLayout
                infinite_scroller={artist_names}
                banner="Browse Artists"
            >
                <div>
                    <ArtistNav
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        sortBy={sortBy as string | null}
                        onSortChange={setSortBy}
                        sortOrder={sortOrder}
                        onOrderChange={setSortOrder}
                        selectedPriceRange={selectedPriceRange}
                        onPriceRangeChange={setSelectedPriceRange}
                    />

                    <div className="grid-cols-[repeat(auto-fit,minmax(150px,1fr))] sm:grid-cols-[repeat(auto-fit,minmax(180px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(250px,1fr))] grid gap-2 md:gap-4 xl:gap-8 justify-between mx-2 md:mx-4 xl:mx-8 mb-4 lg:mb-8">
                        {sortedFilteredData.map((artist: ArtistType) => (
                            <div key={artist.id}>
                                <Artist
                                    id={artist.id || ""}
                                    imageLocation={artist.image || ""}
                                    name={artist.name}
                                    instagram={artist.instagram}
                                    description={artist.description || ""}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </LandingLayout>

            <Outlet />
        </div>
    );
}
