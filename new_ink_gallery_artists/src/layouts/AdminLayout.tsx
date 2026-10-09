import Sidebar from "./components/Admin/Navigation";
// import DashboardHeader from "./components/Header";
// import Board from "./components/Board";

interface LayoutProps {
    children: React.ReactNode;
    cta?: string,
    handleCta?: () => void
}



export default function Layout({children, cta, handleCta}: LayoutProps) {
    return (
            <div className="flex-col flex md:flex-row gap-4 md:gap-0 bg-white w-full h-screen md:overflow-hidden">
                <Sidebar />
                <div className="w-full h-[screen-4] relative max-w-[1800px]">
                    {cta && <div className="flex justify-between md:border-b py-4 px-4">
                        <h3 className="text-2xl font-semibold hidden md:block">New Ink Gallery Dashboard</h3>
                        {cta &&<h3 className="text-xl font-semibold md:hidden">Dashboard</h3>}
                        {cta && <div onClick={handleCta && handleCta} className="bg-black text-white rounded py-1 px-2 cursor-pointer">{cta}</div>}
                    </div>}
                    <div className="lg:px-0">
                        {children}
                    </div>
                </div>
            </div>
    );
}
