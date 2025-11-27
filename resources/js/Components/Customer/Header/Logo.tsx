import React from "react";
import { Link } from "@inertiajs/react";

const Logo: React.FC = () => {
    return (
        <Link
            href="/"
            className="flex-shrink-0 flex items-center justify-center"
        >
            <img
                src="/images/logo.png"
                alt="Paikari World"
                className="h-8 sm:h-10 w-auto"
            />
        </Link>
    );
};

export default Logo;
