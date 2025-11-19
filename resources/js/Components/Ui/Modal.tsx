import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface ModalProps {
    show: boolean;
    onClose: () => void;
    children: React.ReactNode;
    maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
    closeable?: boolean;
}

const Modal: React.FC<ModalProps> = ({
    show,
    onClose,
    children,
    maxWidth = "2xl",
    closeable = true,
}) => {
    const modalRef = useRef<HTMLDivElement>(null);

    const maxWidthClasses = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
    };

    // Close modal on Escape key press
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape" && show) {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [show, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (show) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [show]);

    if (!show) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={closeable ? onClose : undefined}
            />

            {/* Modal Container */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div
                    ref={modalRef}
                    className={`
                        relative w-full ${maxWidthClasses[maxWidth]} 
                        transform overflow-hidden rounded-xl bg-[#0E1614] 
                        border border-[#1E2826] shadow-2xl 
                        transition-all
                    `}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    {closeable && (
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 
                                       p-2 text-gray-400 hover:text-white 
                                       transition-colors rounded-lg 
                                       hover:bg-[#1E2826]"
                            aria-label="Close modal"
                        >
                            <X size={20} />
                        </button>
                    )}

                    {/* Modal Content */}
                    <div className="relative">{children}</div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
