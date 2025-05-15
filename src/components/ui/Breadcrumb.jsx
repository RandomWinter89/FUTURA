import { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Breadcrumb = () => {
    const location = useLocation().pathname;
    const navigate = useNavigate();
    

    const paths = location.split("/");

    return (
        < >

        </>
    )
}