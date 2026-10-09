import Popup from "../../../../layouts/components/Common/Popup"
import MultiImageUpload from "../Commons/ImageUploads"
import { usePopup } from "../../../../context/hooks/usePopUp"
import { useForm } from "react-hook-form"
import { create_idea, delete_idea, update_idea } from "../../../../api/tattoo_ideas"
import { CreateTattooIdea, TattooIdea } from "../../../../types/TattooIdea"
import { useState, useEffect } from "react"
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { upload_images, delete_images } from "../../../../api/images"
import { useApiSend, useApiGet } from "../../../../context/hooks/query"
import { get_tags } from "../../../../api/tags"
import TagSelector from "../../../../layouts/components/Common/TagSelector"
import MultiFormWrapper from "../../../../components/common/MultiRenderedForm"

function AddTattooIdeaForm() {
    const { hidePopup, handleHidePopup } = usePopup();

    const [uploadingImage, setUploadingImage] = useState(false);
    const [tags, setTags] = useState<{ id: string; name: string; selected: boolean }[]>([]);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [removedInitialImages, setRemovedInitialImages] = useState<string[]>([]);
    const queryClient = useQueryClient();
    const [deleting, setDeleting] = useState(false)

    const {
        data: tags_data,
        isLoading: loadingTags,
        isFetching: fetchingTags,
    } = useApiGet(["tags"], get_tags);

    const {
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateTattooIdea>();

    const handle_delete_idea= async () =>{
        setDeleting(true)
        await delete_idea(hidePopup.data.id).then(()=>{
            queryClient.invalidateQueries({ queryKey: ["tattoo_ideas"] }).then(()=>{
                handleHidePopup({show: false, type: "create"})
            });
        })
    }

    useEffect(() => {
        if (tags_data) {
            const formattedTags = tags_data.map(tag => ({
                id: tag.id,
                name: tag.tag,
                selected: hidePopup.data?.tags?.some(t => t.id === tag.id) || false
            }));
            setTags(formattedTags);
        }
    }, [tags_data, hidePopup.data?.tags]);

    const handleTagClick = (tagId: string) => {
        setTags(prev => prev.map(tag => tag.id === tagId ? { ...tag, selected: !tag.selected } : tag));
    };

    const handleOldImageRemoved = (url: string) => {
        setRemovedInitialImages(prev => [...prev, url]);
    };

    const handleImagesSelected = (files: File[]) => {
        if (files.length > 0) {
            setSelectedImage(files[0]);
        }
    };

    const operation = hidePopup.type === "create"
        ? create_idea
        : (data: CreateTattooIdea) => update_idea(data, hidePopup.data.id);

    const { mutateAsync: mutateIdeas, isPending: isCreating } = useApiSend(operation, undefined, undefined, ["tattoo_ideas"]);

    const onSubmit = async (data: CreateTattooIdea) => {
        const selectedTagIds = tags.filter(tag => tag.selected).map(tag => tag.id);
        const ideaData: TattooIdea = {
            ...data,
            tags: selectedTagIds,
        };

        try {
            setUploadingImage(true);

            if (hidePopup.type === "edit") {
                if (removedInitialImages.length > 0) {
                    await delete_images({ images: removedInitialImages });
                }

                if (selectedImage) {
                    const formData = new FormData();
                    formData.append("images", selectedImage);
                    formData.append("entity", "idea");
                    await upload_images(formData, hidePopup.data.id);
                } else {
                    ideaData.image = undefined;
                }

                await mutateIdeas(ideaData);
                await queryClient.invalidateQueries({ queryKey: ["tattoo_ideas"] });
                toast.success("Tattoo idea updated successfully.");
            } else {
                const createdWork = await mutateIdeas(ideaData) as TattooIdea;

                if (selectedImage) {
                    const formData = new FormData();
                    formData.append("images", selectedImage);
                    formData.append("entity", "idea");
                    await upload_images(formData, createdWork.id);
                }

                await queryClient.invalidateQueries({ queryKey: ["tattoo_ideas"] });
                toast.success("Tattoo idea created successfully.");
            }

            reset();
            setUploadingImage(false);
            handleHidePopup({ show: false, type: "create" });
            // await queryClient.invalidateQueries({ queryKey: ["tattoo_ideas"] });
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong.");
            setUploadingImage(false);
        }
    };

    return (
        <div>
            <MultiImageUpload
                onImagesSelected={handleImagesSelected}
                onOldImageRemoved={handleOldImageRemoved}
                initial_images={hidePopup.data?.image ? [hidePopup.data.image] : []}
                maxFiles={1}
            />

            <div className="flex flex-col mt-4">
                <TagSelector
                    tags={tags}
                    onChange={setTags}
                    disabled={isCreating || uploadingImage}
                    loadingStatus = { loadingTags || fetchingTags}
                />
                </div>

            <form onSubmit={handleSubmit(onSubmit)} className="">
                <div className={`flex justify-between ${hidePopup.type == "create" && "items-center justify-end"}`}>
                    {hidePopup.type == "edit" && <button type="button" onClick={handle_delete_idea} className="outline-none my-4 rounded bg-red-500 text-white py-1 px-2 max-w-[8rem] text-center">
                        {deleting ? "Deleting..." :"Delete"}
                        </button>}
                    <button
                        type="submit"
                        disabled={isCreating || uploadingImage}
                        className="outline-none my-4 rounded bg-black text-white py-1 px-2 max-w-[8rem] text-center"
                    >
                        {(isCreating || uploadingImage) ? 'Saving...' : hidePopup.type === "create" ? "Add Idea" : "Save"}
                    </button>
                </div>
            </form>
        </div>
    );
}


export default function AddMultipleIdeas() {
    const {hidePopup} = usePopup()
    return (
        <Popup title={hidePopup.type === "create" ? "Upload tattoo inspo": "Edit tattoo inspo"} max_w="sm:max-w-[500px] md:max-w-[700px]">
            {/* {hidePopup.type === "create" ? <MultiFormWrapper renderForm={(formId) => <AddTattooIdeaForm key={formId} />} />: <AddTattooIdeaForm />} */}
            <AddTattooIdeaForm />
        </Popup>
    );
}