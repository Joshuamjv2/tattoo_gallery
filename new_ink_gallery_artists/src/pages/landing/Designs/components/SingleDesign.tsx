interface DesignProps {
    imageLocation?: string;
    name: string;
    price?: number;
    description?: string;
}


export default function SingleDesign({
        imageLocation,
        name,
        price,
        description
    }: DesignProps){
    return (
        <div className="cursor-pointer">
            <p className="font-semibold text-lg font-geo">{name}</p>
            {imageLocation && <img className="w-[600px] sm:w-[300px] " src={imageLocation} alt={name} />}
            {price && <p className="italic text-[1.2rem] font-roboto"><span className="mr-2">$</span>{price}</p>}
            {/* <p>Design name</p> */}

            {description && <p className="hidden">{description}</p>}
        </div>
    )
}
