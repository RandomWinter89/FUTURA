import { useState, useEffect } from 'react';
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
        < >
            <Button onClick={toggleDarkMode}>
                Enable Dark Mode
            </Button>

            <h2 className='text-black dark:text-white dark:bg-black'>LIGHTER</h2>
        </>
    )
}

export default ToggleMode;