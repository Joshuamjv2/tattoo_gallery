import Layout from "../../../layouts/AdminLayout";
import { get_appointment_requests } from "../../../api/appointment_requests";
import LoadingModal from "../../../components/common/Loading";
import { useApiGet } from "../../../context/hooks/query";
import { useState } from "react";
import AppointmentRequests from "./Requests";
import ApproveAppointment from "../../../components/admin/ApproveAppointment";
import ApprovedAppointments from "./Approved";
import { usePopup } from "../../../context/hooks/usePopUp";


export default function Appointments(){

    const {hidePopup} = usePopup()
    const [showing, setShowing] = useState("Requests")
    const handle_showing_toggle = (show_value: string) => {
        setShowing(show_value)
    }

    const {
        data,
        isLoading,
        isFetching,
        isFetched
        } = useApiGet(["appointment_requests"], get_appointment_requests);

    if (isFetching || isLoading){
            return <LoadingModal />
        }


    const popup = <ApproveAppointment />

    const showOptions = ["Requests", "Appointments"]
    const approved_appointments = data?.filter(item => item.approved) || []
    const pending_appointments = data?.filter(item => !item.approved) || []


    return (
        <div>
            {hidePopup.show && popup}
            <Layout>
                {isFetched&&<div className="px-8">
                    <div className="flex justify-between items-center mt-4 px-1">
                        <div className="font-semibold md:text-2xl text-lg capitalize">
                            <span className="hidden font-bold sm:font-semibold sm:inline-block">Manage </span> appointments
                        </div>
                        <div className="flex gap-4 items-center clear-start">
                        {showOptions.map(option => (
                        <h4
                            onClick={() => handle_showing_toggle(option)}
                            key={option}
                            className={`font-semibold cursor-pointer ${
                            option === showing ? "text-black" : "text-gray-500"
                            }`}
                        >
                            {option}
                        </h4>
                        ))}
                        </div>
                    </div>
                </div>}
                {showing === "Requests" ? <AppointmentRequests data={pending_appointments} />: <ApprovedAppointments data={approved_appointments} />}
            </Layout>
        </div>
    )
}