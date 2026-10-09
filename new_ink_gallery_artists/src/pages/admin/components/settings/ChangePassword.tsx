import { useForm } from "react-hook-form";
import { ChangePassword as ChangePasswordType } from "../../../../types/Auth";
import { change_password, logout } from "../../../../api/authentication";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ChangePassword() {
    const { handleSubmit, register, reset } = useForm<ChangePasswordType>();
    const navigate = useNavigate();

    const onSubmit = async (data: ChangePasswordType) => {
        try {
            console.log("Changing password with:", data);

            // Call the change_password endpoint (GET, no args)
            await change_password(data);

            // Call logout endpoint
            await logout().then(()=>{
                localStorage.clear()
                reset();

                // Redirect to login page after short delay
                navigate("/login")
                window.location.reload()
            });

        } catch (err) {
            console.error("Error changing password", err);
            toast.error("Failed to change password.");
        }
    };

    return (
        <div className="px-4 w-full">
            <h3 className="font-semibold text-lg mb-4 sm:hidden">Change your Password</h3>
            <div className="max-w-[500px] mx-auto mt-8 sm:mt-0 sm:py-16 border-2 p-4 rounded-lg sm:border-0 sm:rounded-none">
                <h3 className="font-semibold text-lg mb-4 hidden sm:block">Change your Password</h3>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-4">
                        <input
                            type="password"
                            className="px-2 bg-transparent border-b outline-none py-2"
                            placeholder="Current Password"
                            {...register("old_password", { required: true })}
                        />
                        <input
                            type="password"
                            className="px-2 bg-transparent border-b outline-none py-2"
                            placeholder="New Password"
                            {...register("new_password", { required: true })}
                        />
                        <button
                            type="submit"
                            className="py-1 w-[6rem] rounded-md px-4 outline-none bg-black text-white"
                        >
                            Change
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
