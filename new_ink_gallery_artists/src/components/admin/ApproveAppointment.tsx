import { usePopup } from "../../context/hooks/usePopUp"
import Popup from "../../layouts/components/Common/Popup"
import { formatLocalDateTime } from "../../utils/extra"
import { GrRadialSelected } from "react-icons/gr";
import { GrRadial } from "react-icons/gr";
import { useState } from "react";
import { useApiGet, useApiSend } from "../../context/hooks/query";
import { get_artists } from "../../api/artists";
import SingleDateAppointmentSelector from "./DateSelector";
import { recurring_rules, lengths } from "./appointment_options";
import { delete_appointment_request } from "../../api/appointment_requests";
import { useQueryClient } from "@tanstack/react-query";
import { formatLengthLabel } from "./appointment_options";
import { useForm } from "react-hook-form";
import { update_appointment_request, approve_appointment_request } from "../../api/appointment_requests";
import { get_appointment_requests } from "../../api/appointment_requests";
import { formatLocalTime } from "../../utils/extra";
// import { useQueryClient } from "@tanstack/react-query";


export default function ApproveAppointment(){
    const {hidePopup, handleHidePopup} = usePopup()
    const [selectedDate, setSelectedDate]= useState(hidePopup.data.approved_date ? hidePopup.data.approved_date: hidePopup.data.first_date)
    const [editInfo, setEditInfo] = useState(false)
    const [contactMethod, setContactMethod] = useState(hidePopup.data?.customer_info.contact_method)
    const [selectedArtist, setSelectedArtist] = useState(hidePopup.data?.artist_info?.id || "");
    const [recurringRule, setRecurringRule] = useState(hidePopup.data.recurring_rule || undefined)
    const [isDeleting, setIsDeleting] = useState(false)
    const [selectedLength, setSelectedLength] = useState(hidePopup.data.length || undefined)
    // const queryClient = useQueryClient()
    console.log(selectedDate, "Selected Date")
    const {
            register,
            handleSubmit,
            reset,
            formState: { errors }
        } = useForm({
        defaultValues: {
            first_name: hidePopup.data.customer_info.first_name,
            last_name: hidePopup.data.customer_info.last_name,
            email: hidePopup.data.customer_info.email || "",
            phone: hidePopup.data.customer_info.phone || "",
            notes: hidePopup.data.notes || "",}
        }
    );
    const dates = [
        hidePopup.data.first_date,
        hidePopup.data.second_date,
        hidePopup.data.third_date
    ]
    const queryClient = useQueryClient()
    const handle_update_appointment_request = hidePopup.data.approved ? (data) => update_appointment_request(data, hidePopup.data.id): (data) => approve_appointment_request(data, hidePopup.data.id)

    const handle_delete_appointment_request =async (id) => {
        setIsDeleting(true)
        await delete_appointment_request(id).then(()=>{
            queryClient.invalidateQueries({ queryKey: ["appointment_requests"] })
            setIsDeleting(false)
            handleHidePopup({show: false, type: "create"})
        })
    }

    const {
            data,
            isFetched
        } = useApiGet(["today_appointments"], get_appointment_requests);

    const contact_methods = ["email", "text"]

    // fetch the day's approved appointments
    const today = new Date();
const approved_appointments = data?.filter(item => {
    if (!item.approved || !item.approved_date) return false;

    const approvedDate = new Date(item.approved_date);

    return (
        approvedDate.getFullYear() === today.getFullYear() &&
        approvedDate.getMonth() === today.getMonth() &&
        approvedDate.getDate() === today.getDate()
    );
    }) || [];

    const {
        data: artists,
    } = useApiGet(["artists"], get_artists);

    const {mutate, isPending} = useApiSend(handle_update_appointment_request, undefined, undefined, ["appointment_requests"])
    const handle_direct_approval = () => {
        const req_data = {
            approved_date: selectedDate,
            approved: true,
            length: selectedLength,
            recurringRule: recurringRule
        }
        mutate(req_data, {
            onSuccess: () => {
                // toast.success("Our team will reach out to confirm an appointment")
                reset()
                queryClient.invalidateQueries({ queryKey: ["appointment_requests"] })
                handleHidePopup({show: false, type: "create"})
            },
            onError: () => {
                // toast.error("Error creating appointment request")
                queryClient.invalidateQueries({ queryKey: ["appointment_requests"] })
                handleHidePopup({show: false, type: "create"})
                // reset()
                }
            })
    }

    const onSubmit = (data) => {
        const payload = {
            ...data,
            selectedArtist,
            selectedLength,
            recurringRule,
            date: selectedDate,
            contact_method: contactMethod
        };
        const data_to_submit = {
            length: selectedLength,
            artist: selectedArtist.id,
            approved_date: selectedDate,
            notes: payload.notes,
            recurring_rule: recurringRule,
            approved: true,
            customer_info: {
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                phone: data.phone,
                contact_method: contactMethod
            }
        }

        mutate(data_to_submit, {
            onSuccess: () => {
                // toast.error("Our team will reach out to confirm an appointment")
                reset()
                queryClient.invalidateQueries({ queryKey: ["appointment_requests"] })
                reset()
                handleHidePopup({show: false, type: "create"})
            },
            onError: () => {
                // toast.error("Error creating appointment request")
                queryClient.invalidateQueries({ queryKey: ["appointment_requests"] })
                handleHidePopup({show: false, type: "create"})
                reset()
                },
            })
    };

    return (
        <Popup title={editInfo && "Edit Appointment Info"} max_w="max-w-[45rem]">
            <div>
                {!editInfo ? <div className="px-[.5rem] sm:[px-2rem] md:px-[4rem]">
                    <h4 className="font-semibold text-center mt-2 text-2xl">{hidePopup.data.approved ? "Appointment": "Booking Request"}</h4>
                    <h6 className="text-center text-xs font-semibold text-black/50 italic">Submitted on {formatLocalDateTime(hidePopup.data.created_at)}</h6>
                    {hidePopup.data.artist_info && <div className="py-2 text-center font-semibold">{!hidePopup.data.approved && "Request"} For {hidePopup.data.artist_info.name}</div>}
                    <p className="italic text-black/50 px-8 text-center mt-4">{hidePopup.data.notes && `"${hidePopup.data.notes}"`}</p>

                    {/* images */}
                    {hidePopup.data.images && <div className="w-full flex justify-center items-center">
                        <img src={hidePopup.data.images[0]} width={200} alt="" />
                    </div>}
                    <div className="justify-center md:px-[2rem] text-center items-center sm:text-left sm:justify-between flex flex-col sm:flex-row sm:items-start mt-8">
                        {/* client info */}
                        <h3 className="text-xl font-semibold">{hidePopup.data.customer_info.first_name} {hidePopup.data.customer_info.last_name}</h3>
                        <div className="font-semibold text-xs text-black/50 mt-1">
                            <p>{hidePopup.data.customer_info.phone}</p>
                            <p>{hidePopup.data.customer_info.email}</p>
                            <p className="text-black">Contact by: <span className="capitalize text-black/50 hover:text-black cursor-pointer">
                            <a href={`mailto:${hidePopup.data.customer_info.contact_method}`}>{hidePopup.data.customer_info.contact_method}</a>
                            </span></p>
                        </div>
                    </div>

                    {/* Dates */}

                    <div className="text-center mt-4 sm:mt-4">
                        {/* <h3 className="font-semibold mb-2 text-lg sm:text-xl">Select Date</h3> */}
                        <div className="flex w-full justify-center items-center">
                            {hidePopup.data.approved ? <p className="text-center font-medium text-lg md:text-xl mb-2 text-black/60">Set Date: {formatLocalDateTime(selectedDate)}</p>:<ul className="space-y-2 md:space-y-0 md:flex items-center gap-4 font-semibold">
                                {dates.map(item => <li className={`flex gap-2 items-center ${selectedDate === item ? "text-black": "text-black/50"}`} key={item}>
                                    <div className="text-[.8rem] sm:text-base cursor-pointer" onClick={()=>setSelectedDate(item)}>{selectedDate === item ? <GrRadialSelected />: <GrRadial />}</div>
                                    <p>{formatLocalDateTime(item)}</p>
                                </li>)}
                            </ul>}
                        </div>
                    </div>

                    <div className="flex justify-center mt-6 gap-4 mb-4">
                        {!hidePopup.data.approved && <button disabled={isPending} onClick={handle_direct_approval} className={`rounded-md bg-green-400 px-2 w-[6rem] py-1 font-medium hover:scale-105 hover:transition-all ${isPending && "animate-pulse"}`}>Confirm</button>}
                        <button disabled={isPending || isDeleting || editInfo} onClick={()=>setEditInfo(true)} className="rounded-md bg-blue-400 px-4 py-1 w-[6rem] font-medium hover:scale-105 hover:transition-all">Edit</button>
                        <button onClick={()=>handle_delete_appointment_request(hidePopup.data.id)} className={`rounded-md bg-red-400 px-4 py-1 w-[6rem] font-medium hover:scale-105 hover:transition-all ${isDeleting && "animate-pulse"}`}>Delete</button>
                    </div>

                    {/* Today's appointments */}
                {isFetched && approved_appointments.length > 0 && (
                    <div className="mt-12 mb-4">
                        <h3 className="font-semibold mb-2 text-lg">Today's Appointments</h3>
                        {approved_appointments.length > 0 ?<div className="w-full flex flex-col border rounded-md divide-y">
                        {approved_appointments.map((appt, index) => (
                            <div onClick={()=>handleHidePopup({type: "edit", show: true, data: appt})} key={index} className="flex cursor-pointer hover:bg-black/20 rounded justify-between gap-4 items-start px-4 py-3 text-sm">
                                <div className="flex-1 font-medium">
                                    <div className="">
                                        <p>{appt.customer_info.first_name} {appt.customer_info.last_name}</p>
                                        <p className="text-xs text-black/50">{formatLocalTime(appt.approved_date)} - {formatLocalTime(appt.approved_date, appt.length)}</p>
                                    </div>
                                </div>
                                <div className="flex-[2] text-black/70 hidden sm:block">{appt.notes}</div>
                                <div className="flex-1 text-right font-semibold text-black/80"><span className="text-xs text-black/50">With</span> {appt.artist_info?.name}</div>
                            </div>
                        ))}
                        </div>: <div className="w-full border-t-2"><div className="mt-2 font-semibold text-black/50">You have no appointments today!</div></div>}
                    </div>
                )}
                </div>
                :<div className="mx-0 sm:my-4">
                    <form onSubmit={handleSubmit(onSubmit)} id="approve">
                        <div className="">
                            <h4 className="font-semibold mb-2 text-black/50">Customer</h4>

                            <div className="flex gap-4 justify-between mb-4">
                                <input
                                    {...register("first_name", { required: true })}
                                    className="w-full rounded py-1 bg-transparent border outline-none px-2"
                                    type="text"
                                    placeholder="First Name"
                                />
                                <input
                                    {...register("last_name", { required: true })}
                                    className="w-full rounded py-1 bg-transparent border outline-none px-2"
                                    type="text"
                                    placeholder="Last Name"
                                />
                            </div>
                            <div className="flex gap-4 justify-between mb-4">
                                <input
                                    {...register("email", { required: true })}
                                    className="w-full rounded py-1 bg-transparent border outline-none px-2" type="text"
                                    placeholder="Email"
                                />
                                <input
                                    className="w-full rounded py-1 bg-transparent border outline-none px-2"
                                    type="text"
                                    {...register("phone", { required: true })}
                                    placeholder="Phone"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <h4 className="w-[8rem] text-sm font-semibold text-black/50">Contact Method</h4>
                                <div className="border flex justify-between w-full rounded-md">{contact_methods.map(method => <div onClick={()=>setContactMethod(method)} className={`w-full capitalize py-1 rounded-md text-center border-r last:border-r-0 cursor-pointer ${contactMethod === method && "bg-black text-white"}`} key={method}>{method}</div>)}</div>
                            </div>

                        </div>

                        <div className="w-full">
                            <h4 className="flex flex-col text-sm font-semibold gap-2 text-black/50 my-2">Notes</h4>
                            <textarea {...register("notes")} className="border bg-transparent rounded-md w-full outline-none p-4" rows={4}/>
                        </div>

                        {/* Artist */}
                        <div className="mt-4 flex w-full justify-between items-center gap-4">
                            <div className="w-full">
                                <h4 className="font-semibold mb-2 text-black/50">Artist</h4>
                                <select
                                    className="w-full rounded py-1 bg-transparent border outline-none px-2"
                                    value={selectedArtist}
                                    onChange={(e) => setSelectedArtist(e.target.value)}
                                >
                                    {hidePopup.data.artist_info && (
                                    <option value={hidePopup.data.artist_info.id}>
                                        {hidePopup.data.artist_info.name}
                                    </option>
                                    )}
                                    {artists &&
                                    artists
                                        .filter((a) => a.id !== hidePopup.data.artist_info?.id)
                                        .map((artist) => (
                                        <option key={artist.id} value={artist.id}>
                                            {artist.name}
                                        </option>
                                        ))}
                                </select>
                            </div>
                            <div className="w-full">
                                <h4 className="font-semibold mb-2 text-black/50">Length</h4>
                                <select
                                    className="w-full py-1 rounded-md border outline-none bg-transparent px-2"
                                    value={selectedLength}
                                    onChange={(e) => {
                                    // You may also update some `length` state if needed
                                        setSelectedLength(parseInt(e.target.value)); 
                                    }}
                                >
                                    {lengths.map(length => (
                                    <option key={length} value={length}>
                                        {formatLengthLabel(length)}
                                    </option>
                                    ))}
                                </select>
                                </div>
                        </div>
                    </form>
                    {/* date */}
                    <div className="flex mt-4 flex-col sm:flex-row sm:gap-4 sm:items-center">
                        <div className="w-full">
                            <SingleDateAppointmentSelector
                            initialDate={{
                                date: selectedDate,
                            }}
                            onChange={(slot) => {
                                setSelectedDate(slot.date)
                            }}
                            />
                        </div>
                        <div className="w-full">
                            {/* select repeat cycle */}
                            <div className="w-full">
                                <h4 className="font-semibold text-black/50 mb-2">Repeat Cycle</h4>
                                <select
                                    className="w-full rounded py-1 bg-transparent border outline-none px-2"
                                    value={recurringRule ?? ""}
                                    onChange={(e) =>
                                    setRecurringRule(e.target.value === "" ? undefined : e.target.value)
                                    }
                                >
                                    <option value="">No</option>
                                    {recurring_rules.map((rule) => (
                                    <option key={rule.value ?? "No"} value={rule.value ?? undefined}>
                                        {rule.label}
                                    </option>
                                    ))}

                                    {/* Handle case where hidePopup.data.recurring_rule is not in recurringRules */}
                                    {recurringRule &&
                                    !recurring_rules.some((rule) => rule.value === recurringRule) && (
                                        <option value={recurringRule}>{recurringRule}</option>
                                    )}
                                </select>
                                </div>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                        <button disabled={isPending || isDeleting} className="rounded-md text-sm font-semibold border-red-400 border outline-none px-2 py-1" onClick={()=>{
                            setSelectedDate(hidePopup.data.first_date)
                            setEditInfo(false)
                        }}>Cancel</button>
                        <div className="flex gap-4 items-center">
                            <button disabled={isDeleting || isPending} type="button" onClick={()=>handle_delete_appointment_request(hidePopup.data.id)} className={`rounded-md text-sm font-semibold bg-red-400 border outline-none px-2 py-1 ${isDeleting && "animate-pulse"}`}>Delete</button>
                            <button disabled={isPending || isDeleting} form="approve" type="submit" className={`rounded-md text-sm font-semibold bg-green-400 border outline-none px-2 py-1 ${isPending && "animate-pulse"}`}>{ hidePopup.data.approved ? "Save": "Confirm"}</button>
                        </div>
                    </div>
                </div>
                }
            </div>
        </Popup>
    )
}