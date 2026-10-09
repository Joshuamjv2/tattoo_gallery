import { usePopup } from "../../../../context/hooks/usePopUp"
import { useApiGet } from "../../../../context/hooks/query"
import LoadingModal from "../../../../components/common/Loading"
import { FlexibleTable } from "../../../../components/common/Table"
import { get_appointment_requests } from "../../../../api/appointment_requests"
import { formatLocalDateTime } from "../../../../utils/extra"
import { ColumnDef } from "@tanstack/react-table"
import ApproveAppointment from "../../../../components/admin/ApproveAppointment"

export default function ArtistAppointments({artist_id}: {artist_id?: string}){
    const {hidePopup, handleHidePopup} = usePopup()

    const handle_row_click = (appt) => {
        console.log("This is the row")
        handleHidePopup({type: "edit", show: true, data: appt, modal: "artist_appointments"})
    }
    const {
            data,
            isLoading,
            isFetching,
            isFetched
        } = useApiGet(["appointment_requests"], get_appointment_requests);

    let artist_data = []
    if (data){
        artist_data = data.filter(item => item.artist_info?.id === artist_id)
    }

    const popup = <ApproveAppointment />

    const dataColumns: ColumnDef<any>[] = [
            {
                header: "Customer",
                accessorKey: "customer_info",
                cell: ({row}) => (<div>{row.original.customer_info?.first_name} {" "} {row.original.customer_info.last_name}</div>)
            },
            {
                header: "Customer Contact",
                accessorKey: "idea",
                cell: ({row}) => {
                    const contact_method = row.original.customer_info.contact_method
                    const contact_display = contact_method === "email" ? row.original.customer_info.email: row.original.customer_info.phone
                    return <div>{contact_display}</div>
                }
            },
            {
                header: "Contact By",
                accessorKey: "customer",
                cell: ({row}) => {
                    const contact_method = row.original.customer_info.contact_method
                    return <div className="capitalize">{contact_method}</div>
                }
            },
            {
                header: "Submitted On",
                accessorKey: "created_at",
                cell: ({row}) => {
                    return <div>{formatLocalDateTime(row.original.created_at)}</div>
                }
            },
            {
                header: "Approved",
                accessorKey: "id",
                cell: ({row}) => {
                    return <div className={`${row.original.approved && "text-green-400 font-bold"}`}>{row.original.approved ? "Yes": "No"}</div>
                }
            }
    ]

    if (isLoading){
        return <LoadingModal />
    }

    return (
        <div>
            {hidePopup.show && hidePopup.modal === "artist_appointments" && popup}
            <div className="">
                {isFetched && <FlexibleTable onRowClick={handle_row_click} data={artist_data} columns={dataColumns} />}
            </div>
        </div>
    )
}
