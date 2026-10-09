import { useState } from "react";
import Layout from "../../layouts/AdminLayout";
import { currentPage } from "./components/settings/SettingsNavigation";
import ManageTags from "./components/settings/ManageTags";
import ChangePassword from "./components/settings/ChangePassword";
import ManageUsers from "./components/settings/ManageUsers";
import SettingNavigation from "./components/settings/SettingsNavigation";
import { get_tags } from "../../api/tags";
import { useApiGet } from "../../context/hooks/query";


export default function Profile() {
    const [current_page, setCurrentPage] = useState<currentPage>({key: "tags", name: "Manage Tags"});

    const {
            data: tags,
            isLoading,
            isFetching,
            isFetched: tagsFetched
        } = useApiGet(["tags"], get_tags);


    const ui_mapping = {
        // manage_users: <ManageUsers />,
        tags: <ManageTags tags={tags} isFetched={tagsFetched} />,
        change_password: <ChangePassword />
    };

    const handle_nav_toggle = (nav: currentPage) => {
        setCurrentPage(nav);
    };

    return (
        <div className="">
            <Layout>
                <div className="w-full">
                    <div className="lg:px-4 mb-8 relative max-w-[1200px]  mx-auto">
                        <SettingNavigation
                            handle_click={handle_nav_toggle} 
                            current_page={current_page}  
                        />

                        {/* I want this to take on the full width of the parent without overflowing */}
                        <div className="w-full mt-4 lg:border rounded-3xl overflow-y-auto no-scrollbar md:px-0" style={{ maxHeight: 'calc(85vh)' }}>
                            {ui_mapping[current_page.key as keyof typeof ui_mapping]}
                        </div>
                    </div>
                </div>
            </Layout>
        </div>
    );
}