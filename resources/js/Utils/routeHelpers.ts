import { usePage } from "@inertiajs/react";

/**
 * Check if a route pattern matches the current route
 * @param routeName - The route name to check (e.g., 'admin.products.index')
 * @param pattern - The pattern to match against (e.g., 'admin.products.*' or 'admin.products.index')
 * @returns boolean - Whether the route matches the pattern
 */
export function useRouteMatch(pattern: string): boolean {
    const { url } = usePage();
    const currentRoute = url;

    // Exact match
    if (currentRoute === pattern) {
        return true;
    }

    // Pattern matching with wildcards
    if (pattern.includes('*')) {
        const regexPattern = pattern
            .replace(/\./g, '\\.')
            .replace(/\*/g, '.*');
        const regex = new RegExp(`^${regexPattern}$`);
        return regex.test(currentRoute);
    }

    // Check if current route starts with the pattern (for nested routes)
    if (currentRoute.startsWith(pattern)) {
        return true;
    }

    return false;
}

/**
 * Check if any of the route patterns match the current route
 * @param patterns - Array of route patterns to check
 * @returns boolean - Whether any pattern matches
 */
export function useRouteMatchAny(patterns: string[]): boolean {
    const { url } = usePage();
    const currentRoute = url;

    return patterns.some(pattern => {
        // Exact match
        if (currentRoute === pattern) {
            return true;
        }

        // Pattern matching with wildcards
        if (pattern.includes('*')) {
            const regexPattern = pattern
                .replace(/\./g, '\\.')
                .replace(/\*/g, '.*');
            const regex = new RegExp(`^${regexPattern}$`);
            return regex.test(currentRoute);
        }

        // Check if current route starts with the pattern
        if (currentRoute.startsWith(pattern)) {
            return true;
        }

        return false;
    });
}

/**
 * Get the active menu key based on current route
 * Useful for determining which sidebar item should be highlighted
 */
export function useActiveRoute(): string {
    const { url } = usePage();

    // Extract the main section from the URL
    // e.g., /admin/products/create -> products
    // e.g., /admin/dashboard -> dashboard
    const parts = url.split('/').filter(Boolean);

    if (parts.length >= 2) {
        return parts[1]; // Return the second part (after /admin/)
    }

    return parts[0] || 'dashboard';
}
