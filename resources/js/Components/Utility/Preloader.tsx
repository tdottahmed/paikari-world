// components/Preloader.tsx
import React, { useEffect, useState } from "react";

const Preloader: React.FC = () => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Hide preloader after 3 seconds or when page is fully loaded
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 3000);

        // Also hide when page is fully loaded
        window.addEventListener("load", () => {
            setIsVisible(false);
        });

        return () => {
            clearTimeout(timer);
            window.removeEventListener("load", () => setIsVisible(false));
        };
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-[#0C1311] z-50 flex items-center justify-center">
            <div className="text-center">
                {/* Animated Logo */}
                <div className="mb-8">
                    <div className="w-20 h-20 mx-auto mb-4 relative">
                        <div className="absolute inset-0 border-4 border-[#2DE3A7] rounded-lg animate-ping opacity-75"></div>
                        <div className="absolute inset-0 border-4 border-[#2DE3A7] rounded-lg"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-bold text-[#2DE3A7]">
                                PW
                            </span>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Paikari World
                    </h1>
                    <p className="text-gray-400">Loading your dashboard...</p>
                </div>

                {/* Loading Animation */}
                <div className="flex justify-center space-x-2">
                    <div className="w-3 h-3 bg-[#2DE3A7] rounded-full animate-bounce"></div>
                    <div
                        className="w-3 h-3 bg-[#2DE3A7] rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                        className="w-3 h-3 bg-[#2DE3A7] rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default Preloader;
