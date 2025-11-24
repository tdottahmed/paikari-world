import React from "react";

const Hero: React.FC = () => {
    return (
        <div className="relative bg-gray-900 overflow-hidden">
            {/* Background Pattern/Image */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-800 to-indigo-900 mix-blend-multiply" />
            </div>

            <div className="relative max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                    <span className="block"> WELCOME </span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">
                        TO
                    </span>
                    <span className="block"> PAIKARI WORLD </span>
                </h1>
                <p className="mt-6 max-w-lg mx-auto text-xl text-gray-300 sm:max-w-3xl">
                    Your one - stop destination for wholesale products.Best
                    prices, premium quality, and fast delivery.
                </p>

                {/* Decorative Elements (mimicking the fun vibe of the screenshot) */}
                <div className="hidden md:block absolute top-1/2 left-10 transform -translate-y-1/2 animate-bounce duration-1000">
                    <span className="text-6xl">🐹</span>
                </div>
                <div className="hidden md:block absolute top-1/2 right-10 transform -translate-y-1/2 animate-bounce duration-1000 delay-150">
                    <span className="text-6xl">🍌</span>
                </div>
            </div>
        </div>
    );
};

export default Hero;
