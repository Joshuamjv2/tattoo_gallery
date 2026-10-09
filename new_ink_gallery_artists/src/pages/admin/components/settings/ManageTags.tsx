import { useState } from "react";
import { BiPencil, BiTrash, BiCheck } from "react-icons/bi";
import { GrRadial } from "react-icons/gr";
import { useForm } from "react-hook-form";
import { useApiSend } from "../../../../utils/hooks/query";
import { Tag } from "../../../../types/Tag";
import { create_tag, delete_tag, update_tag } from "../../../../api/tags";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { IoCloseOutline } from "react-icons/io5";

export default function ManageTags({ tags, isFetched }: { tags: Tag[], isFetched: any }) {
    const [add_mode, setAddMode] = useState(false);
    const [edit_mode, setEditMode] = useState(false);
    const [selectedTag, setSelectedTag] = useState<Tag | undefined>(undefined);
    const [deleting, setDeleting] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const queryClient = useQueryClient();
    const { handleSubmit, register, reset, setValue } = useForm();

    const { mutate: createTag, isPending: creating } = useApiSend(create_tag, undefined, undefined, ["tags"]);
    const { mutate: updateTag, isPending: updating } = useApiSend(
        (data: Tag) => update_tag(data, selectedTag?.id),
        undefined,
        undefined,
        ["tags"]
    );

    const handleInitEdit = (tag: Tag) => {
        setSelectedTag(tag);
        setValue("tag", tag.tag);
        setEditMode(true);
    };

    const onSubmit = async (data: Tag) => {
        const tagName = data.tag.trim();

        // Check for existing tag
        const existingTag = tags.find(t => t.tag.toLowerCase() === tagName.toLowerCase());

        if (existingTag && !selectedTag) {
            toast.success("Tag already exists — selecting it!");
            setAddMode(false);
            setSearchTerm("");
            return;
        }

        if (selectedTag) {
            updateTag(
                { ...data },
                {
                    onSuccess: async () => {
                        await queryClient.invalidateQueries({ queryKey: ["tags"] });
                        reset();
                        setSelectedTag(undefined);
                        setEditMode(false);
                        setSearchTerm("");
                    },
                    onError: () => {
                        toast.error("Error updating tag");
                    },
                }
            );
        } else {
            createTag(
                { tag: tagName },
                {
                    onSuccess: async () => {
                        await queryClient.invalidateQueries({ queryKey: ["tags"] });
                        reset();
                        setAddMode(false);
                        setSearchTerm("");
                    },
                    onError: () => {
                        toast.error("Error creating tag");
                        setAddMode(false);
                        reset();
                        setSearchTerm("");
                    },
                }
            );
        }
    };

    const handle_delete_tag = async (tag: Tag) => {
        setSelectedTag(tag);
        setDeleting(true);
        await delete_tag(tag.id).then(async () => {
            await queryClient.invalidateQueries({ queryKey: ["tags"] });
            setDeleting(false);
            setSelectedTag(undefined);
        });
    };

    // Filter tags by searchTerm
    const filteredTags = searchTerm.length > 0
        ? tags.filter(t => t.tag.toLowerCase().includes(searchTerm.toLowerCase()))
        : tags;

    return (
        isFetched && (
            <div className="px-4 md:py-4 space-y-2">
                {/* Header */}
                <div className="flex justify-between items-center mb-4 gap-4">
                    <h2 className="sm:text-lg text-base font-semibold min-w-[7rem]">Manage Tags</h2>

                    {!add_mode ? (
                        <button
                            onClick={() => setAddMode(true)}
                            className="text-black border-2 text-base px-3 py-1 border-dashed border-black/50 rounded-3xl min-w-[4rem] bg-white"
                        >
                            + Add Tag
                        </button>
                    ) : (
                        <div className="text-black border-2 py-1 border-dashed border-black/50 rounded-3xl min-w-[3rem] bg-white">
                            <form onSubmit={handleSubmit(onSubmit)} className="flex px-2">
                                <input
                                    type="text"
                                    placeholder="Tag"
                                    className="bg-transparent active:bg-transparent outline-none flex-1"
                                    {...register("tag")}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    disabled={creating || updating}
                                />
                                <div className="flex bg-transparent gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAddMode(false);
                                            reset()
                                            setSearchTerm("");
                                        }}
                                        disabled={creating || updating}
                                        className="font-bold rounded-full border p-1 cursor-pointer"
                                    >
                                        <IoCloseOutline size={15} />
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={creating || updating}
                                        className="font-bold rounded-full border p-1"
                                    >
                                        <BiCheck size={15} className={`${(creating || updating) && "animate-pulse"}`} />
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>

                {/* Tag List - scrollable */}
                <div className="py-4 rounded-md scrollbar-hide">
                    {filteredTags && filteredTags.length > 0 ? (
                        <div
                            className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 
                            max-h-[600px] overflow-y-auto 
                            scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 scrollbar-hide"
                        >
                            {filteredTags.map((tag: Tag) => (
                                !edit_mode ? (
                                    <div key={tag.id}>
                                        <div className="flex items-center capitalize justify-between border rounded-3xl px-4 py-2 border-dashed hover:bg-gray-50">
                                            <div className="flex items-center gap-3">
                                                <GrRadial className="hidden" />
                                                <p>{tag?.tag}</p>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <button
                                                    onClick={() => handleInitEdit(tag)}
                                                    disabled={creating || updating}
                                                >
                                                    <BiPencil size={18} className={`hover:text-blue-500 ${creating && "animate-pulse"}`} />
                                                </button>
                                                <button
                                                    onClick={() => handle_delete_tag(tag)}
                                                    disabled={creating || updating || deleting}
                                                >
                                                    <BiTrash size={18} className={`hover:text-red-500 ${(deleting && selectedTag?.id === tag.id) && "animate-pulse"}`} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    selectedTag && selectedTag.id === tag.id && (
                                        <div
                                            className="flex items-center justify-between border rounded-3xl px-3 py-2 border-dashed hover:bg-gray-50"
                                            key={tag.id}
                                        >
                                            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                                                <div className="flex justify-between items-center w-full">
                                                    <input
                                                        type="text"
                                                        minLength={1}
                                                        className="bg-transparent active:bg-transparent outline-none w-full mr-2"
                                                        {...register("tag")}
                                                        defaultValue={selectedTag.tag}
                                                    />
                                                    <div className="flex gap-2">
                                                        <button
                                                            type="button"
                                                            disabled={creating || updating}
                                                            className={`font-bold rounded-full border p-1 ${updating && "animate-pulse"}`}
                                                            onClick={()=>{
                                                                setEditMode(false)
                                                                reset()
                                                            }}
                                                        >
                                                            <IoCloseOutline size={20} />
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            disabled={creating || updating}
                                                            className={`font-bold rounded-full border p-1 ${updating && "animate-pulse"}`}
                                                        >
                                                            <BiCheck size={20} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    )
                                )
                            ))}
                        </div>
                    ) : (
                        <div className="min-h-12 text-center text-gray-500">No tags</div>
                    )}
                </div>
            </div>
        )
    );
}
