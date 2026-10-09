export type currentPage = {
    name: string,
    key: string
}

interface NavProps {
    current_page: currentPage,
    handle_click: (item: currentPage) => void;  // Now accepts a string parameter
}


export default function SettingNavigation({ handle_click, current_page }: NavProps) {
    const items = [
        // { key: "manage_users", name: "Manage Users" },
        { key: "tags", name: "Manage Tags" },
        { key: "change_password", name: "Change Password" }
    ];

    return (
        <div className="flex gap-4 justify-start sm:justify-center mt-4 w-full">
            {items.map(item => (
                <div 
                    onClick={() => handle_click(item)}
                    className={`
                        relative
                        text-[.8rem]
                        sm:text-lg 
                        sm:font-semibold
                        cursor-pointer 
                        mx-4 
                        pb-2
                        transition-all 
                        duration-300
                        ease-in-out
                        after:content-['']
                        after:absolute
                        after:bottom-0
                        after:left-0
                        after:w-full
                        after:h-[3px]
                        after:bg-black
                        after:px-2
                        after:scale-x-0
                        after:origin-left
                        after:transition-all
                        after:duration-300
                        ${current_page.key === item.key ? 'after:scale-x-100' : 'hover:after:scale-x-0'}
                    `}
                    key={item.key}
                >
                    {item.name}
                </div>
            ))}
        </div>
    );
}