import { useState } from "react";
import { BiPencil, BiTrash, BiCheck } from "react-icons/bi";
import { GrRadial } from "react-icons/gr";
import { useForm } from "react-hook-form";
import { useApiSend } from "../../../../utils/hooks/query";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { IoCloseOutline } from "react-icons/io5";

export default function ManageUsers() {

return (
    <div className="px-4 md:py-4 space-y-2">
        <h3 className="text-lg font-semibold max-w-[600px] mx-auto">Manage Users</h3>
    </div>
)

}
