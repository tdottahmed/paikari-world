import { useEffect } from "react";
import NProgress from "nprogress";
import { usePage } from "@inertiajs/react";

const ProgressBar = () => {
    const { progress } = usePage();

    useEffect(() => {
        if (progress) {
            NProgress.start();

            if (progress === 1) {
                // Complete
                setTimeout(() => {
                    NProgress.done(true);
                }, 300);
            }
        }
    }, [progress]);

    return null;
};

export default ProgressBar;
