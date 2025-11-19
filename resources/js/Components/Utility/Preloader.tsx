import React, { useEffect, useState } from "react";

const Preloader: React.FC = () => {
    const [loadingProgress, setLoadingProgress] = useState(0);

    useEffect(() => {
        // Fast progress animation - completes in ~800ms
        const interval = setInterval(() => {
            setLoadingProgress((prev) => {
                const newProgress = prev + Math.random() * 40;
                if (newProgress >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return newProgress;
            });
        }, 80);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 bg-[#0C1311] z-50 flex items-center justify-center">
            <div className="text-center">
                {/* Logo */}
                <div className="mb-6">
                    <div className="w-16 h-16 mx-auto mb-3 relative">
                        <div className="absolute inset-0 border-3 border-[#2DE3A7] rounded-lg animate-pulse"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl font-bold text-[#2DE3A7]">
                                PW
                            </span>
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-1">
                        Paikari World
                    </h1>
                    <p className="text-gray-400 text-sm">Loading...</p>
                </div>

                {/* Progress Bar */}
                <div className="w-48 mx-auto bg-gray-700 rounded-full h-1.5 mb-3">
                    <div
                        className="bg-[#2DE3A7] h-1.5 rounded-full transition-all duration-100 ease-out"
                        style={{ width: `${loadingProgress}%` }}
                    ></div>
                </div>

                {/* Loading Percentage */}
                <div className="text-[#2DE3A7] text-xs font-medium">
                    {Math.round(loadingProgress)}%
                </div>
            </div>
        </div>
    );
};

export default Preloader;
