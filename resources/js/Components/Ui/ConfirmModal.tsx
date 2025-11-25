import { useEffect } from "react";
import { X, AlertTriangle, Info, CheckCircle, AlertCircle } from "lucide-react";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "info" | "success";
    isLoading?: boolean;
}

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "warning",
    isLoading = false,
}: ConfirmModalProps) {
    // Handle ESC key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen && !isLoading) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            // Prevent body scroll when modal is open
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, isLoading, onClose]);

    // Handle Enter key for confirm
    useEffect(() => {
        const handleEnter = (e: KeyboardEvent) => {
            if (e.key === "Enter" && isOpen && !isLoading) {
                onConfirm();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEnter);
        }

        return () => {
            document.removeEventListener("keydown", handleEnter);
        };
    }, [isOpen, isLoading, onConfirm]);

    if (!isOpen) return null;

    const variantConfig = {
        danger: {
            icon: AlertCircle,
            iconColor: "text-red-500",
            iconBg: "bg-red-500/10",
            buttonBg: "bg-red-500 hover:bg-red-600",
            buttonText: "text-white",
        },
        warning: {
            icon: AlertTriangle,
            iconColor: "text-yellow-500",
            iconBg: "bg-yellow-500/10",
            buttonBg: "bg-yellow-500 hover:bg-yellow-600",
            buttonText: "text-[#0C1311]",
        },
        info: {
            icon: Info,
            iconColor: "text-blue-500",
            iconBg: "bg-blue-500/10",
            buttonBg: "bg-blue-500 hover:bg-blue-600",
            buttonText: "text-white",
        },
        success: {
            icon: CheckCircle,
            iconColor: "text-green-500",
            iconBg: "bg-green-500/10",
            buttonBg: "bg-green-500 hover:bg-green-600",
            buttonText: "text-white",
        },
    };

    const config = variantConfig[variant];
    const Icon = config.icon;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={!isLoading ? onClose : undefined}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            {/* Modal */}
            <div
                className="relative bg-[#0E1614] border border-[#1E2826] rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#1E2826] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Close modal"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Content */}
                <div className="p-6">
                    {/* Icon */}
                    <div
                        className={`w-12 h-12 rounded-full ${config.iconBg} flex items-center justify-center mb-4`}
                    >
                        <Icon className={`w-6 h-6 ${config.iconColor}`} />
                    </div>

                    {/* Title */}
                    <h3
                        id="modal-title"
                        className="text-xl font-bold text-white mb-2"
                    >
                        {title}
                    </h3>

                    {/* Message */}
                    <p
                        id="modal-description"
                        className="text-sm text-gray-300 leading-relaxed mb-6"
                    >
                        {message}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 px-4 py-2.5 bg-[#1E2826] text-gray-300 rounded-lg font-semibold text-sm hover:bg-[#2A3633] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={`flex-1 px-4 py-2.5 ${config.buttonBg} ${config.buttonText} rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                        >
                            {isLoading && (
                                <svg
                                    className="animate-spin h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    >
                                        {" "}
                                    </circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    >
                                        {" "}
                                    </path>
                                </svg>
                            )}
                            {isLoading ? "Processing..." : confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
