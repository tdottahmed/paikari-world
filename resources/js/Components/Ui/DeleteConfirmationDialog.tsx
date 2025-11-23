import { XIcon, AlertTriangleIcon } from "lucide-react";
import PrimaryButton from "@/Components/Actions/PrimaryButton";
import DangerButton from "@/Components/Actions/DangerButton";

interface DeleteConfirmationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    isProcessing?: boolean;
}

export default function DeleteConfirmationDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Delete",
    isProcessing = false,
}: DeleteConfirmationDialogProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <AlertTriangleIcon className="w-6 h-6 text-red-500 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {title}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <XIcon size={20} />
                    </button>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {message}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                    <PrimaryButton
                        as="button"
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isProcessing}
                        className="w-full sm:w-auto"
                    >
                        Cancel
                    </PrimaryButton>
                    <DangerButton
                        type="button"
                        onClick={onConfirm}
                        disabled={isProcessing}
                        className="w-full sm:w-auto"
                    >
                        {isProcessing ? "Deleting..." : confirmText}
                    </DangerButton>
                </div>
            </div>
        </div>
    );
}
