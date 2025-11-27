import React from "react";
import { MessageCircle } from "lucide-react";

const MessengerIcon: React.FC = () => {
    return (
        <button
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Messenger"
        >
            {/* Using a colored icon to match the screenshot style if possible, or just standard */}
            <MessageCircle size={24} className="text-purple-600" />
        </button>
    );
};

export default MessengerIcon;
