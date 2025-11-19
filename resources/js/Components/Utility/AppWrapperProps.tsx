import React, { useEffect, useState } from "react";
import Preloader from "./Preloader";

interface AppWrapperProps {
    children: React.ReactNode;
}

const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
    const [showPreloader, setShowPreloader] = useState(true);
    const [isContentReady, setIsContentReady] = useState(false);

    useEffect(() => {
        // Wait for both: minimum preloader time AND content to be ready
        const minimumPreloaderTime = 2000; // 2 seconds minimum
        const preloaderTimer = setTimeout(() => {
            setIsContentReady(true);
        }, minimumPreloaderTime);

        // Additional: wait for images and fonts to load
        window.addEventListener("load", () => {
            setIsContentReady(true);
        });

        // Hide preloader after content is ready and minimum time has passed
        const hidePreloaderTimer = setTimeout(() => {
            setShowPreloader(false);
        }, minimumPreloaderTime + 500); // Extra 500ms for smooth transition

        return () => {
            clearTimeout(preloaderTimer);
            clearTimeout(hidePreloaderTimer);
            window.removeEventListener("load", () => setIsContentReady(true));
        };
    }, []);

    return (
        <>
            {/* Preloader */}
            <div
                className={`fixed inset-0 z-50 transition-opacity duration-500 ${
                    showPreloader
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none"
                }`}
            >
                <Preloader />
            </div>

            {/* Main Content - Always rendered but hidden behind preloader */}
            <div
                className={`transition-opacity duration-500 ${
                    showPreloader ? "opacity-0" : "opacity-100"
                }`}
            >
                {children}
            </div>
        </>
    );
};

export default AppWrapper;
