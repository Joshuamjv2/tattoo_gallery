import SingleAdminArtist from "./AdminArtist";
import { Artist as ArtistType } from "../../../../types/Artist";

export default function ArtistsAdmin({artists}: {artists: ArtistType[]}){
    return (
        <div>
        <div className="py-4 px-4">
                <div className="flex items-center justify-center ">
                    <div className="grid-cols-1 no-scrollbar overflow-y-scroll sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 grid gap-8 justify-between no-scrollbar h-[80vh] md:h-[85vh]" >
                        {
                            artists.map((artist) => (
                                <div key={artist.id}>
                                    <SingleAdminArtist
                                        id={artist.id}
                                        imageLocation={artist.image ? artist.image: ""}
                                        name={artist.name}
                                        instagram={artist.instagram}
                                        description={artist.description ? artist.description: ""}
                                    />
                                </div>
                                ))
                        }
                    </div>
                </div>
        </div>
        </div>
    )
}