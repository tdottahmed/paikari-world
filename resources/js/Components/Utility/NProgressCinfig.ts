import NProgress from "nprogress";

export const configureNProgress = () => {
    NProgress.configure({
        minimum: 0.08,
        easing: "ease",
        speed: 200,
        trickle: true,
        trickleSpeed: 200,
        showSpinner: false,
        parent: "body",
        template: '<div class="bar" role="bar"></div>',
    });
};
