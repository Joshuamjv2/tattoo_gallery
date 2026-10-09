import { FlexibleTable } from "../../../components/common/Table";
import { formatLocalDateTime } from "../../../utils/extra";
import { usePopup } from "../../../context/hooks/usePopUp";


export default function AppointmentRequests({data}: {data: any}){
    const {handleHidePopup} = usePopup()

    const handleRowClick = (row) => handleHidePopup({show: true, type: "edit", data: row})

    const dataColumns: ColumnDef<any>[] = [
        {
            header: "Artist",
            accessorKey: "artist_info",
            cell: ({row}) => (<div>{row.original.artist_info?.name || "Available Artist"}</div>)
        },
        {
            header: "Customer",
            accessorKey: "customer_info",
            cell: ({row}) => (<div>{row.original.customer_info?.first_name} {" "} {row.original.customer_info.last_name}</div>)
        },
        {
            header: "Customer Contact",
            accessorKey: "customer",
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
        }
    ]

    return (
    <div>
    {data && <div className="px-8 py-4"><FlexibleTable onRowClick={handleRowClick} columns={dataColumns} data={data} /></div>}
    </div>
    )
}