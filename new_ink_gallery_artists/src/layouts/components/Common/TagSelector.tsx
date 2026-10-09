import { Tag } from "../../../types/Tag";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { create_tag } from "../../../api/tags";
import { IoIosClose } from "react-icons/io";
import { CiCircleCheck } from "react-icons/ci";
import { useQueryClient } from "@tanstack/react-query";
import { useApiSend } from "../../../context/hooks/query";
import { toast } from "react-toastify";

type TagSelectorProps = {
    tags: Tag[];
    onChange: (updatedTags: Tag[]) => void;
    disabled?: boolean;
    loadingStatus?: boolean;
};

const TagSelector: React.FC<TagSelectorProps> = ({ tags, onChange, loadingStatus = true, disabled = false }) => {
    const { reset } = useForm();
    const [searchTerm, setSearchTerm] = useState("");

    const queryClient = useQueryClient();
    const { mutate: createTag, isPending } = useApiSend(create_tag, undefined, undefined, ["tags"]);

    const handleTagClick = (tagId: string) => {
        if (disabled) return;

        const updatedTags = tags.map(tag =>
            tag.id === tagId ? { ...tag, selected: !tag.selected } : tag
        );

        onChange(updatedTags);
    };

    const handleClear = () => {
        reset();
        setSearchTerm("");
    };

    const handleCreateTag = () => {
        const existingTag = tags.find(tag => tag.name.toLowerCase() === searchTerm.toLowerCase());

        if (existingTag) {
            toast.success("Tag already exists — selecting it");
            handleTagClick(existingTag.id);
            handleClear();
            return;
        }

        const tagData = { tag: searchTerm };

        createTag(tagData, {
            onSuccess: async () => {
                await queryClient.invalidateQueries({ queryKey: ["tags"] });
                handleClear();
            },
            onError: () => {
                toast.error("Error creating tag");
                handleClear();
            },
        });
    };

    const filteredTags = searchTerm.length > 0
        ? tags.filter(tag => tag.name.toLowerCase().includes(searchTerm.toLowerCase()))
        : tags;

    return loadingStatus ? (
        <div>
            <label className="border py-1 px-2 rounded border-black/20 text-black/70 w-[6rem] text-center text-sm font-semibold">
                Tags
            </label>
            <div className="mt-2 border p-4 rounded grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="rounded-3xl bg-gray-100 border p-2 h-10 animate-pulse" />
                ))}
            </div>
        </div>
    ) : (
        <div>
            {/* Header row */}
            <div className="flex justify-between mb-2">
                <label className="border py-1 px-2 rounded border-black/20 text-black/70 w-[6rem] text-center text-sm font-semibold">
                    Tags
                </label>

                {/* Search bar */}
                <div
                    className={`border border-black/20 placeholder:font-semibold rounded px-2 py-1 flex items-center gap-2 w-[16rem] ${
                        isPending ? "animate-pulse" : ""
                    }`}
                >
                    <input
                        type="text"
                        minLength={3}
                        placeholder="Search or create tag..."
                        className="bg-transparent border-none outline-none flex-1 text-sm"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                    {searchTerm.length > 0 && (
                        <>
                            <IoIosClose
                                className="cursor-pointer"
                                size={20}
                                onClick={handleClear}
                            />
                            <button
                                onClick={handleCreateTag}
                                type="button"
                                className="cursor-pointer"
                            >
                                <CiCircleCheck size={20} />
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Tag list */}
            <div className="grid grid-cols-2 gap-4 max-h-[10rem] overflow-y-auto scrollbar-hide sm:grid-cols-3 border p-4 rounded">
                {filteredTags.map(tag => (
                    <div
                        key={tag.id}
                        onClick={() => handleTagClick(tag.id)}
                        className={`rounded-3xl cursor-pointer border px-2 py-1 block text-center ${
                            tag.selected ? "bg-green-800 text-white" : "bg-gray-50"
                        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        # {tag.name}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TagSelector;
