import Popup from "../../../../../layouts/components/Common/Popup"
import MultiImageUpload from "../../../components/Commons/ImageUploads"
import { usePopup } from "../../../../../context/hooks/usePopUp"
import { useForm } from "react-hook-form"
import { create_artist_work, delete_artist_work, update_artist_work } from "../../../../../api/portfolio"
import { CreatePortfolio, Portfolio } from "../../../../../types/Portfolio"
import { useState, useEffect } from "react"
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { upload_images, delete_images } from "../../../../../api/images"
import { useApiSend, useApiGet } from "../../../../../context/hooks/query"
import { get_tags } from "../../../../../api/tags"
import { useNavigate } from "react-router-dom"
import TagSelector from "../../../../../layouts/components/Common/TagSelector"

export default function AddArtistWork({ artist_id }: { artist_id?: string }) {
    const { hidePopup, handleHidePopup } = usePopup();
    const [uploadingImage, setUploadingImage] = useState(false);
    const [tags, setTags] = useState<{ id: string; name: string; selected: boolean }[]>([]);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [removedInitialImages, setRemovedInitialImages] = useState<string[]>([]);
    const queryClient = useQueryClient();
    const [deleting, setDeleting] = useState(false)
    const navigate = useNavigate()

    const {
        data: tags_data,
        isLoading: loadingTags,
        isFetching: fetchingTags,
    } = useApiGet(["tags"], get_tags);

    const {
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm<CreatePortfolio>({
        defaultValues: {
            artist: artist_id,
        },
    });

    const handle_delete_work = async () =>{
        setDeleting(true)
        await delete_artist_work(hidePopup.data.id).then(()=>{
            queryClient.invalidateQueries({queryKey: [artist_id]}).then(()=>{
                setDeleting(false)
                handleHidePopup({show: false, type: "create"})
                queryClient.invalidateQueries({ queryKey: [artist_id + "work", artist_id] });
            })
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
        ? create_artist_work
        : (data: CreatePortfolio) => update_artist_work(data, hidePopup.data.id);

    const { mutateAsync: mutateArtistWork, isPending: isCreating } = useApiSend(operation, undefined, undefined, [artist_id + "work"]);

    const onSubmit = async (data: CreatePortfolio) => {
        const selectedTagIds = tags.filter(tag => tag.selected).map(tag => tag.id);
        const portfolioData: Portfolio = {
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
                    formData.append("entity", "artist_work");
                    await upload_images(formData, hidePopup.data.id);
                } else {
                    portfolioData.image = undefined;
                }

                await mutateArtistWork(portfolioData);
                await queryClient.invalidateQueries({ queryKey: [artist_id + "work", artist_id] });
                toast.success("Artist work updated successfully.");
            } else {
                const createdWork = await mutateArtistWork(portfolioData) as Portfolio;

                if (selectedImage) {
                    const formData = new FormData();
                    formData.append("images", selectedImage);
                    formData.append("entity", "artist_work");
                    await upload_images(formData, createdWork.id);
                }

                await queryClient.invalidateQueries({ queryKey: [artist_id + "work", artist_id] });
                toast.success("Artist work created successfully.");
            }

            reset();
            setUploadingImage(false);
            handleHidePopup({ show: false, type: "create" });
            // await queryClient.invalidateQueries({ queryKey: [artist_id + "work", artist_id] });
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong.");
            setUploadingImage(false);
        }
    };

    return (
        <Popup title={hidePopup.type === "create" ? "Add New Artist Work" : "Edit Artist Work Details"} max_w="sm:max-w-[500px] md:max-w-[700px]">
            <MultiImageUpload
                onImagesSelected={handleImagesSelected}
                onOldImageRemoved={handleOldImageRemoved}
                initial_images={hidePopup.data?.image ? [hidePopup.data.image] : []}
                maxFiles={1}
            />
            <div className="mt-4">
                <TagSelector
                    tags={tags}
                    onChange={setTags}
                    disabled={isCreating || uploadingImage}
                    loadingStatus = { loadingTags || fetchingTags}
                />
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
                <div className={`flex justify-between ${hidePopup.type == "create" && "items-center justify-end"}`}>
                    {hidePopup.type == "edit" && <button type="button" onClick={handle_delete_work} className="outline-none my-4 rounded bg-red-500 text-white py-1 px-2 max-w-[8rem] text-center">
                        {deleting ? "Deleting..." :"Delete"}
                        </button>}
                    <button
                        type="submit"
                        disabled={isCreating || uploadingImage}
                        className="outline-none my-4 rounded bg-black text-white py-1 px-2 max-w-[8rem] text-center"
                    >
                        {(isCreating || uploadingImage) ? 'Saving...' : hidePopup.type === "create" ? "Add Work" : "Save"}
                    </button>
                </div>
            </form>
        </Popup>
    );
}
