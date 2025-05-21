import { useState, useEffect } from 'react';
import { IconTheme } from '../icon';
import { Button } from '../ui'

const ToggleMode = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    
    useEffect(() => {
    if (isDarkMode) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <div onClick={toggleDarkMode} className='group cursor-pointer transition-all duration-300'>
            <IconTheme darkMode={isDarkMode} className={`stroke-black dark:stroke-white group-hover:scale-125`} />
        </div>
    )
}

export default ToggleMode;