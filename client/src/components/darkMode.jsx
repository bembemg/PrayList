import { useState, useEffect } from 'react';

export default function DarkModeToggle() {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        if(localStorage.theme === 'dark') {
            document.documentElement.classList.add('dark');
            setDarkMode(true);
        }
    }, []);

    const toggleDarkMode = () => {
        if(darkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
        } else {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
        }
        setDarkMode(!darkMode);
    };

    return (
        <button
            onClick={toggleDarkMode}
            className="fixed top-4 right-4 p-2 rounded-lg bg-50 dark:bg-800 text-800 dark:text-50"
        >
            {darkMode ? '🌞' : '🌜'}
        </button>
    )
}