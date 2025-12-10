import React from "react";
import { MessageCircle } from "lucide-react";
import { usePage } from "@inertiajs/react";

const MessengerIcon: React.FC = () => {
    const { messengerLink }: any = usePage().props;

    if (!messengerLink) {
        return null;
    }

    return (
        <a
            href={messengerLink}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Messenger"
        >
            <MessageCircle size={24} className="text-purple-600" />
        </a>
    );
};

export default MessengerIcon;
