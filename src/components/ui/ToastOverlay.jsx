import { useEffect } from "react";

const ToastOverlay = ({show, onHide, desc}) => {
    useEffect(() => {
        if (!show) return;

        const timer = setTimeout(() => {
            onHide();
        }, 1500);

        return () => clearTimeout(timer);
    }, [show, onHide]);

    if (!show) return null;

    return (
        <div 
            onClick={() => onHide()} 
            className="fixed inset-0 flex"
            role="dialog"
            arial-modal="true"
        >
            <div className='size-80 m-auto flex justify-center items-center text-center bg-black text-white'>
                <h2>{desc}</h2>
            </div>
        </div>
    )
}

export default ToastOverlay;