import { IoIosCheckboxOutline } from "react-icons/io";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { Tag } from "../../../../types/Tag";

interface Props {
    tags?: Tag[];
    selectedTags?: Tag[];
    onToggle?: (tag: Tag) => void;
}

export default function Categories({ tags = [], selectedTags = [], onTagToggle }: Props) {
    console.log(selectedTags)
    return (
        <div className="hidden px-4 mt-4">
        <h2 className="font-semibold font-geo text-xl">Tags</h2>
        <div className="mt-2 bg-gray-100/50 rounded">
            <ul className="flex flex-col gap-4 max-h-[50vh] overflow-auto scrollbar-hide p-4 min-w-[15rem]">
            {tags.map(tag => (
                <li key={tag.id} className="cursor-pointer" onClick={() => onTagToggle?.(tag)}>
                <div className="flex items-center gap-2 text-lg">
                    {selectedTags.some(t => t.id === tag.id) ? (
                    <IoIosCheckboxOutline />
                    ) : (
                    <MdCheckBoxOutlineBlank />
                    )}
                    <h4 className="capitalize">{tag.tag}</h4>
                </div>
                </li>
            ))}
            </ul>
        </div>
        </div>
    );
}
