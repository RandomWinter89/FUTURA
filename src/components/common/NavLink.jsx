import { Link } from 'react-router-dom';

const NavLink = ({path, name}) => {

    return (
        <Link 
            to={`${path}`}
            className="
                text-2xl 
                max-lg:text-xl max-sm:text-sm 
                hover:bg-black hover:p-2 hover:rounded-md hover:text-white transition-all
            "
        >
            {name}
        </Link>
    )
}

export default NavLink;