import Popup from "../../../../layouts/components/Common/Popup";
import MultiImageUpload from "../Commons/ImageUploads";
import { usePopup } from "../../../../context/hooks/usePopUp";
import { useState, useEffect } from "react";
import { useApiSend, useApiGet } from "../../../../context/hooks/query";
import { create_design, update_design } from "../../../../api/designs";
import { CreateDesign, Design } from "../../../../types/Design";
import { useForm } from "react-hook-form";
import { get_tags } from "../../../../api/tags";
import { upload_images, delete_images } from "../../../../api/images";
import { delete_design } from "../../../../api/designs";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import TagSelector from "../../../../layouts/components/Common/TagSelector";


export default function AddDesign() {
    const { hidePopup, handleHidePopup } = usePopup();
    const [images, setImages] = useState<File[]>([]);
    const [tags, setTags] = useState<{id: string, name: string, selected: boolean}[]>([]);
    const [uploadingImage, setUploadingImage] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [removedInitialImages, setRemovedInitialImages] = useState<string[]>([]);

    const handleOldImageRemoved = (url: string) => {
        setRemovedInitialImages(prev => [...prev, url]);
    };

    const queryClient = useQueryClient();

    const operation = hidePopup.type === "create" ? create_design : (data: CreateDesign) => {
        return update_design(data, hidePopup.data.id);
    };

    const {
        data: tags_data,
        isLoading,
        isFetching,
    } = useApiGet(["tags"], get_tags);

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
        setTags(prevTags => 
            prevTags.map(tag => 
                tag.id === tagId 
                    ? { ...tag, selected: !tag.selected } 
                    : tag
            )
        );
    };

    const handleImagesSelected = (selectedImages: File[]) => {
        setImages(prevImages => [...prevImages, ...selectedImages]);
    };

    const { register, handleSubmit, reset } = useForm<CreateDesign>();
    const { mutate: createDesign, isPending: isCreating } = useApiSend(operation, undefined, undefined, ["designs"]);


    const onSubmit = async (data: CreateDesign) => {
        const selectedTagIds = tags
            .filter(tag => tag.selected)
            .map(tag => tag.id);

        let designData = {
            ...data,
            tags: selectedTagIds,
            images: [] // Initialize with empty array, will be updated after upload
        };

        if (hidePopup.type === "edit"){
            const change_design = (design) => {
                createDesign(design, {onSuccess: (() => {
                    queryClient.invalidateQueries({queryKey: ["designs"]}).then(()=>{
                    handleHidePopup({show: false, type: "create"})
                    setUploadingImage(false)
                    reset()
                    return
                    })
                })})
            }
            const intitial_images = hidePopup.data.images
            setUploadingImage(true)
            if (removedInitialImages.length > 0){
                await delete_images({images: removedInitialImages}).then(()=>{
                    if (images.length > 0){
                        const formData = new FormData()
                        images.forEach((image) => {
                            formData.append('images', image);
                        });
                        formData.append('entity', "design");
                        upload_images(formData, hidePopup.data.id).then(response => {
                            const remaining_images = intitial_images.filter(oldImage => !removedInitialImages.includes(oldImage));
                            designData.images = [...remaining_images, ...response.images]
                            console.log("First call", designData.images)
                            change_design(designData)
                        })
                    } else {
                        const remaining_images = intitial_images.filter(oldImage => !removedInitialImages.includes(oldImage));
                        designData.images = [...remaining_images]
                        change_design(designData)
                    }
                })
            } else {
                if (images.length > 0){
                    const formData = new FormData()
                    images.forEach((image) => {
                        formData.append('images', image);
                    });
                    formData.append('entity', "design");
                    upload_images(formData, hidePopup.data.id).then(response => {
                    designData.images = intitial_images ? [...intitial_images, ...response.images]: [...response.images]
                    change_design(designData)
                })
                } else {
                    designData.images = intitial_images
                    change_design(designData)
                    // createDesign(designData, )
                }
            }
        }

        if (hidePopup.type === "edit"){
            return
        }

        createDesign(designData, {
            onSuccess: async (createdDesign: Design) => {
                if (images.length < 1 || hidePopup.type === "edit"){
                    handleHidePopup({show: false, type: "create"})
                    reset()
                    return
                }
                const formData = new FormData()
                images.forEach((image) => {
                    formData.append('images', image);
                });
                formData.append('entity', "design");
                console.log(formData, "This is the form data")

                setUploadingImage(true)
                await upload_images(formData, createdDesign.id).then(()=>{
                    queryClient.invalidateQueries({queryKey: ["designs"]}).then(()=>{
                    setUploadingImage(false)
                    handleHidePopup({show: false, type: "create"})
                    reset()
                })
                });
            },
            onError: (error) => {
                toast.error("Error creating design")
                console.log(error)
                handleHidePopup({show: false, type: "create"})
            },
        });
    };

    const handle_delete_design = async (id: string) =>{
        setDeleting(true)
        await delete_design(id).then(()=>{
            queryClient.invalidateQueries({queryKey: ["designs"]}).then(()=>{
                setDeleting(false)
                handleHidePopup({show: false, type: "create"})
            })
        })
    }


    return (
        <Popup title={hidePopup.type === "create" ? "Add New Design" : "Edit Design"} max_w="md:max-w-[500px] lg:max-w-[800px]">
            <MultiImageUpload
                onImagesSelected={handleImagesSelected}
                onOldImageRemoved={handleOldImageRemoved}
                maxFiles={4}
                initial_images={hidePopup.data?.images && hidePopup.data.images}
            />
            <div className="mt-4">
                <form onSubmit={handleSubmit(onSubmit)} id="design" className="mb-4">
                    <div className="lg:flex justify-between items-center w-full lg:mt-4 gap-2">
                        <div className="flex flex-col lg:w-1/2">
                            <div className="border px-4 py-2 rounded">
                                <input
                                    type="text"
                                    className="bg-transparent outline-none w-full"
                                    placeholder="Name"
                                    {...register("name", { required: "Name is required" })}
                                    disabled={isCreating || uploadingImage}
                                    defaultValue={hidePopup.type === "edit" && hidePopup.data?.name || ""}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col mt-2 lg:mt-0 lg:w-1/2">
                            <div className="border px-4 py-2 rounded">
                                <input
                                    type="number"
                                    step="0.01"
                                    className="bg-transparent outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    placeholder="Price"
                                    {...register("price", { valueAsNumber: true })}
                                    disabled={isCreating || uploadingImage}
                                    defaultValue={hidePopup.type === "edit" && hidePopup.data?.price || ""}
                                />
                            </div>
                        </div>
                    </div>

                    {/* duration */}
                    <div className="lg:flex justify-between items-center w-full mt-2 lg:mt-2 gap-2">
                        <div className="flex flex-col lg:w-1/2">
                            <div className="border px-4 py-2 rounded">
                                <input
                                    type="number"
                                    className="bg-transparent outline-none w-full"
                                    placeholder="Precise Duration"
                                    {...register("precise_length")}
                                    disabled={isCreating || uploadingImage}
                                    defaultValue={hidePopup.type === "edit" && hidePopup.data?.precise_length || ""}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col mt-2 lg:mt-0 lg:w-1/2">
                            <div className="border px-4 py-2 rounded">
                                <input
                                    type="text"
                                    className="bg-transparent outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    placeholder="Display Duration"
                                    {...register("display_length")}
                                    disabled={isCreating || uploadingImage}
                                    defaultValue={hidePopup.type === "edit" && hidePopup.data?.display_length || ""}
                                />
                            </div>
                        </div>
                    </div>

                    {/* size */}
                    <div className="lg:flex justify-between items-center w-full mt-2 lg:mt-2 gap-2">
                        <div className="flex flex-col lg:w-1/2">
                            <div className="border px-4 py-2 rounded">
                                <input
                                    maxLength={5}
                                    type="text"
                                    className="bg-transparent outline-none w-full"
                                    placeholder="Precise Size"
                                    {...register("precise_size")}
                                    disabled={isCreating || uploadingImage}
                                    defaultValue={hidePopup.type === "edit" && hidePopup.data?.precise_size || ""}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col mt-2 lg:mt-0 lg:w-1/2">
                            <div className="border px-4 py-2 rounded">
                                <input
                                    type="text"
                                    className="bg-transparent outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    placeholder="Display Size"
                                    maxLength={100}
                                    {...register("display_size")}
                                    disabled={isCreating || uploadingImage}
                                    defaultValue={hidePopup.type === "edit" && hidePopup.data?.display_size || ""}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <div className="mt-2 border px-4 py-2 rounded">
                            <textarea
                                rows={2}
                                className="bg-transparent outline-none w-full"
                                placeholder="Description"
                                {...register("description")}
                                disabled={isCreating || uploadingImage}
                                defaultValue={hidePopup.type === "edit" && hidePopup.data?.description || ""}
                            />
                        </div>
                    </div>
                </form>
                <TagSelector
                        tags={tags}
                        onChange={setTags}
                        disabled={isCreating || uploadingImage}
                        loadingStatus = { isLoading || isFetching}
                    />
                    <div className="flex justify-between items-center mt-4">
                        {hidePopup.type === "edit" ? <button
                            onClick={()=>handle_delete_design(hidePopup.data.id)}
                            type="button"
                            // onClick={hidePopup}
                            className="outline-none rounded-xl bg-red-500 text-white py-1 px-4"
                            disabled={isCreating || uploadingImage }
                        >
                            {deleting ? "Deleting..." :"Delete"}
                        </button>: <div></div>}
                        <button
                            form="design"
                            type="submit"
                            className="outline-none rounded-xl bg-black text-white py-1 px-4"
                            disabled={isCreating || uploadingImage}
                        >
                            {isCreating || uploadingImage? 'Saving...' :
                            hidePopup.type === "create" ? "Add Design" : "Save"}
                        </button>
                    </div>
            </div>
        </Popup>
    )
}
