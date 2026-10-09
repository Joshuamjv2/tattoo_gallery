// components/Popup.tsx
import { useEffect, useRef } from "react";
import { usePopup } from "../../../context/hooks/usePopUp";

interface PopupProps {
    children: React.ReactNode;
    title?: string
    max_w?: string
}

export default function Popup({children, title, max_w}: PopupProps) {
    const { hidePopup, handleHidePopup } = usePopup();
    const popupRef = useRef<HTMLDivElement>(null);

    // Close popup when clicking outside or pressing Escape
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
        if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
            event.stopPropagation()
            handleHidePopup({ ...hidePopup, show: false });
        }
        };

        const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            handleHidePopup({ ...hidePopup, show: false });
        }
        };

        if (hidePopup.show) {
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
        }

        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleEscape);
        };
    }, [hidePopup, handleHidePopup]);

    if (!hidePopup.show) return null;

    return (
        <div className="fixed inset-0 z-50">
            {/* Transparent dark background */}
            <div className="fixed inset-0 bg-black bg-opacity-50" />

            {/* Popup container */}
            <div ref={popupRef} className={`fixed mt-16 inset-0 sm:mt-0 sm:inset-auto sm:absolute sm:top-1/2 sm:left-1/2 sm:transform sm:-translate-x-1/2 sm:-translate-y-1/2
                        bg-white rounded-t-lg sm:rounded-lg shadow-xl overflow-hidden
                        ${hidePopup.confirmModel ? 'sm:max-w-md': `${max_w ? max_w : "sm:max-w-[500px] lg:max-w-[1000px]"}`} sm:w-full sm:max-h-[90vh] sm:my-8
                        flex flex-col`}>
                {/* Close button - only show if not a confirm modal */}
                {!hidePopup.confirmModel && (
                <div className="flex justify-between w-full absolute top-0 py-1 px-4 bg-white z-20">
                    <div>{title && <h3 className="font-semibold mt-2">{title}</h3>}</div>
                    <button
                        onClick={() => handleHidePopup({ ...hidePopup, show: false })}
                        className="rounded-full p-1 hover:bg-gray-100 focus:outline-none z-20 focus:ring-2 focus:ring-gray-500"
                        aria-label="Close popup"
                    >
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                )}

                {/* Content area */}
                <div className="flex-1 overflow-y-auto scrollbar-hide p-4 pt-12 sm:pt-8 relative">
                    {/* Render different content based on popup type */}
                    {children}

                {hidePopup.confirmModel && (
                    <div className="text-center p-6">
                    <h3 className="text-lg font-medium mb-4">Are you sure?</h3>
                    <p className="mb-6">This action cannot be undone.</p>
                    <div className="flex justify-center gap-4">
                        <button
                        onClick={() => handleHidePopup({ ...hidePopup, show: false })}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                        >
                        Cancel
                        </button>
                        <button
                        onClick={() => {
                            // Handle confirmation action here
                            if (hidePopup.data?.onConfirm) {
                            hidePopup.data.onConfirm();
                            }
                            handleHidePopup({ ...hidePopup, show: false });
                        }}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                        Confirm
                        </button>
                    </div>
                    </div>
                )}
                </div>
            </div>
        </div>
    );
}