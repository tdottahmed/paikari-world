import { useTheme } from '@/hooks/useTheme';
import React from 'react';

interface ThemeToggleProps {
    mobile?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ mobile = false }) => {
    const { theme, toggleTheme } = useTheme();

    if (mobile) {
        return (
            <button
                onClick={toggleTheme}
                className="rounded-lg bg-[#2DE3A7] p-2 text-black md:hidden"
                aria-label="Toggle theme"
            >
                {theme === 'dark' ? '☀️' : '🌙'}
            </button>
        );
    }

    return (
        <button
            onClick={toggleTheme}
            className="hidden rounded-lg bg-[#2DE3A7] px-4 py-2 font-semibold text-black transition hover:bg-[#22c996] md:block"
        >
            {theme === 'dark' ? 'Light Mode ☀️' : 'Dark Mode 🌙'}
        </button>
    );
};

export default ThemeToggle;
