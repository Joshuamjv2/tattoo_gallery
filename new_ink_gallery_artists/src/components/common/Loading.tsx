export default function LoadingModal({with_lazy = false}: {with_lazy?: boolean}) {

    return (
        // ensure it does not reload when the book appointment button is clicked
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
            <div className="flex flex-col items-center justify-center">
                {with_lazy ? <div></div>:<div className="w-8 h-8 bg-black rounded-full animate-ping duration-300">
                    <img
                        src="/images/logo-black.png"
                        // alt="Loading"
                        className="w-full h-full"
                    />
                    </div>}
            </div>
        </div>
    );
}

export function LoadingModal2({ with_lazy = false }: { with_lazy?: boolean }) {
    return (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
            <div className="flex flex-col items-center justify-center">
                {with_lazy ? (
                    <div></div>
                ) : (
                    <img
                        src="/images/logo-black.png"
                        alt="Loading"
                        className="w-12 h-12 animate-pulseCustom"
                    />
                )}
            </div>
        </div>
    );
}
