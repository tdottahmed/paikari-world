/**
 * Format a number as currency
 * @param amount - The amount to format
 * @param currency - Currency code (default: USD)
 * @param locale - Locale string (default: en-US)
 * @returns Formatted currency string
 */
export const formatCurrency = (
    amount: number | string | null | undefined,
    currency: string = "BDT",
    locale: string = "en-BD"
): string => {
    if (amount === null || amount === undefined || amount === "") {
        return "N/A";
    }

    const numericAmount =
        typeof amount === "string" ? parseFloat(amount) : amount;

    if (isNaN(numericAmount)) {
        return "Invalid amount";
    }

    try {
        return new Intl.NumberFormat(locale, {
            style: "currency",
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(numericAmount);
    } catch (error) {
        return `৳ ${numericAmount.toFixed(2)}`;
    }
};

/**
 * Format a number as price with BDT currency symbol
 * @param amount - The amount to format
 * @param locale - Locale string (default: en-US)
 * @returns Formatted price string with BDT symbol
 */
export const formatPrice = (
    amount: number | string | null | undefined,
    locale: string = "en-US"
): string => {
    if (amount === null || amount === undefined || amount === "") {
        return "N/A";
    }

    const numericAmount =
        typeof amount === "string" ? parseFloat(amount) : amount;

    if (isNaN(numericAmount)) {
        return "Invalid amount";
    }

    try {
        const formattedNumber = new Intl.NumberFormat(locale, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(numericAmount);

        return `৳ ${formattedNumber}`;
    } catch (error) {
        return `৳ ${numericAmount.toFixed(2)}`;
    }
};

// Alternative version with configurable fraction digits
export const formatPriceWithOptions = (
    amount: number | string | null | undefined,
    options: {
        locale?: string;
        minimumFractionDigits?: number;
        maximumFractionDigits?: number;
        fallbackText?: string;
    } = {}
): string => {
    const {
        locale = "en-US",
        minimumFractionDigits = 2,
        maximumFractionDigits = 2,
        fallbackText = "N/A",
    } = options;

    if (amount === null || amount === undefined || amount === "") {
        return fallbackText;
    }

    const numericAmount =
        typeof amount === "string" ? parseFloat(amount) : amount;

    if (isNaN(numericAmount)) {
        return "Invalid amount";
    }

    try {
        const formattedNumber = new Intl.NumberFormat(locale, {
            minimumFractionDigits,
            maximumFractionDigits,
        }).format(numericAmount);

        return `৳ ${formattedNumber}`;
    } catch (error) {
        return `৳ ${numericAmount.toFixed(maximumFractionDigits)}`;
    }
};

/**
 * Generate full file path for images/assets
 * @param path - Relative path to the file
 * @param baseUrl - Base URL (default: empty, will use current origin)
 * @returns Full URL to the file
 */
export const filePath = (
    path: string | null | undefined,
    baseUrl: string = ""
): string => {
    if (!path) {
        return "/images/placeholder.jpg"; // Fallback placeholder image
    }

    // If it's already a full URL, return as is
    if (
        path.startsWith("http://") ||
        path.startsWith("https://") ||
        path.startsWith("//")
    ) {
        return path;
    }

    // Remove leading slash if present to avoid double slashes
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;

    // Use provided baseUrl or default to empty (relative to current origin)
    const base = baseUrl || "";

    return `${base}/${cleanPath}`.replace(/([^:]\/)\/+/g, "$1"); // Remove duplicate slashes
};

/**
 * Generate full URL for Laravel storage files
 * @param path - Path from storage directory
 * @returns Full URL to storage file
 */
export const storagePath = (path: string | null | undefined): string => {
    if (!path || path === "" || path === "null") {
        return placeholderImage(400, 300, "Image Not Found");
    }

    const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin;
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;

    return `${baseUrl}/storage/${cleanPath}`;
};

/**
 * Generate placeholder image URL
 * @param width - Image width
 * @param height - Image height
 * @param text - Optional text to display
 * @returns Placeholder image URL
 */
export const placeholderImage = (
    width: number = 400,
    height: number = 300,
    text: string = "No Image"
): string => {
    const encodedText = encodeURIComponent(text);
    return `https://via.placeholder.com/${width}x${height}?text=${encodedText}`;
};

/**
 * Handle image loading errors by setting a placeholder
 * @param event - React synthetic event
 * @param placeholder - Custom placeholder URL (optional)
 */
export const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>,
    placeholder?: string
) => {
    const target = event.target as HTMLImageElement;
    target.src = placeholder || placeholderImage(400, 300, "Image Not Found");
    target.alt = "Image not available";
};

/**
 * Format file size to human readable format
 * @param bytes - File size in bytes
 * @param decimals - Number of decimal places
 * @returns Formatted file size string
 */
export const formatFileSize = (bytes: number, decimals: number = 2): string => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

/**
 * Validate if a string is a valid URL
 * @param string - String to validate
 * @returns Boolean indicating if it's a valid URL
 */
export const isValidUrl = (string: string): boolean => {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
};

/**
 * Extract file extension from filename or URL
 * @param filename - Filename or URL
 * @returns File extension in lowercase
 */
export const getFileExtension = (filename: string): string => {
    return filename.split(".").pop()?.toLowerCase() || "";
};

/**
 * Check if file is an image based on extension
 * @param filename - Filename or URL
 * @returns Boolean indicating if it's an image
 */
export const isImageFile = (filename: string): boolean => {
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];
    const ext = getFileExtension(filename);
    return imageExtensions.includes(ext);
};

/**
 * Debounce function for performance optimization
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
};

/**
 * Format date to readable string
 * @param date - Date string or Date object
 * @param locale - Locale string (default: en-US)
 * @returns Formatted date string
 */
export const formatDate = (
    date: string | Date,
    locale: string = "en-US"
): string => {
    if (!date) return "N/A";

    const dateObj = typeof date === "string" ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
        return "Invalid date";
    }

    return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(dateObj);
};

/**
 * Format date with time
 * @param date - Date string or Date object
 * @param locale - Locale string (default: en-US)
 * @returns Formatted date and time string
 */
export const formatDateTime = (
    date: string | Date,
    locale: string = "en-US"
): string => {
    if (!date) return "N/A";

    const dateObj = typeof date === "string" ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
        return "Invalid date";
    }

    return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(dateObj);
};

/**
 * Generate a random unique ID
 * @returns Random unique ID string
 */
export const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Truncate text to specified length
 * @param text - Text to truncate
 * @param length - Maximum length
 * @param suffix - Suffix to add (default: ...)
 * @returns Truncated text
 */
export const truncateText = (
    text: string,
    length: number,
    suffix: string = "..."
): string => {
    if (text.length <= length) return text;
    return text.substring(0, length - suffix.length) + suffix;
};

/**
 * Capitalize first letter of a string
 * @param text - Text to capitalize
 * @returns Capitalized text
 */
export const capitalize = (text: string): string => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Convert string to slug
 * @param text - Text to convert
 * @returns Slugified string
 */
export const slugify = (text: string): string => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
};

// Export all helpers
export default {
    formatCurrency,
    formatPrice,
    filePath,
    storagePath,
    placeholderImage,
    handleImageError,
    formatFileSize,
    isValidUrl,
    getFileExtension,
    isImageFile,
    debounce,
    formatDate,
    formatDateTime,
    generateId,
    truncateText,
    capitalize,
    slugify,
};
