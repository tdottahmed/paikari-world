import ApplicationLogo from "@/Components/ApplicationLogo";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-gray-100 mt-auto">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-3">
                        <ApplicationLogo
                            applicationName="Paikari World"
                            size="sm"
                        />
                        <span className="font-bold text-gray-900 text-lg">
                            {" "}
                            Paikari World{" "}
                        </span>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                        <div className="flex items-center gap-1">
                            <span>
                                & copy; {currentYear} Paikari World.All rights
                                reserved.
                            </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                            <span>Developed by </span>
                            <a
                                href="https://nixsoftware.net"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold text-gray-900 hover:text-blue-600 transition-colors flex items-center gap-1"
                            >
                                NixSoftware
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
