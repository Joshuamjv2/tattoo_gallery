import { BsInstagram } from "react-icons/bs";
interface ArtistProps {
    id?: string,
    imageLocation: string;
    name: string;
    instagram: string;
    description: string;
}

export default function SingleAdminArtist({
    id,
    imageLocation,
    name,
    instagram,
    description
    }: ArtistProps) {
    return (
        <div>
            {/* add shadow-lg and rounded-lg hover:shadow-xl transition-shadow duration-300 if you choose the overlay info */}
        <div className="artist-card group relative overflow-hidden cursor-pointer">

        {/* Artist Image */}
        <a href={`/admin/artists/${id}`}>
            <div className="w-full aspect-[3/4] overflow-hidden">
                <img
                    src={imageLocation}
                    alt={`Portrait of ${name}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>
        </a>
        {/*  add to above class if using overlay */} 

        {/* Overlay with artist info */}
        <div className="hidden absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
            <h3 className="text-2xl font-bold text-white mb-2">{name}</h3>
            <a
            href={`https://instagram.com/${instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/80 hover:text-white transition-colors mb-4"
            >
            @{instagram}
            </a>
            <p className="text-white/90 text-sm line-clamp-3">{description}</p>
        </div>

        {/* info below image */}
        </div>
        <div className="px-1">
            <h4 className="font-semibold text-xl xl:text-2xl">{name}</h4>
            <a href={`https://instagram.com/${instagram}`} target="_blank">
                <div className="flex items-center gap-1 text-black/70 cursor-pointer hover:text-black hover:transition-all"><BsInstagram /> <h6>{instagram}</h6></div>
            </a>
        </div>
        </div>
    );
}