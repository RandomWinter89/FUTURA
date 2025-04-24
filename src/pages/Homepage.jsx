import { fetchAllUser, fetch_PersonalFollower, onFollow, onUnfollow } from "../features/usersSlice";
import { useDispatch, useSelector } from "react-redux";

import { useEffect } from "react";

const Homepage = () => {
    const dispatch = useDispatch();
    const { users, personalFollower, users_loading } = useSelector((state) => state.users);

    useEffect(() => {
        dispatch(fetchAllUser());
        dispatch(fetch_PersonalFollower(1));
    }, [dispatch])

    const handle_onFollow = (id, followed_id) => {
        dispatch(onFollow({ id, followed_id }));
    }

    const handle_onUnfollow = (id, followed_id) => {
        dispatch(onUnfollow({ id, followed_id }));
    }

    return (
        <section className="mx-9">
            <h1>Homepage</h1>
            {users_loading ? (
                <p>Loading...</p>
            ) : (
                <ol className="list-inside list-decimal">
                    {users.map((user) => (
                        <li key={user.id}>
                            {user.username}
                            <ul className="list-inside list-disc ml-4">
                                <li>{user.email}</li>
                                <li>{user.phone}</li>
                                <li>{user.gender}</li>
                                <li>{user.birth.split('T')[0]}</li>
                                {user.id === 1 && <li>Followers: {personalFollower.length}</li>}
                            </ul>
                        </li>
                    ))}
                </ol>
            )}
            <button onClick={() => {handle_onFollow(2, 1)}} className="border border-black py-2 px-4">2 FOLLOW 1</button>
            <button onClick={() => {handle_onUnfollow(2, 1)}} className="border border-black py-2 px-4">2 UNFOLLOW 1</button>
        </section>
    )
}

export default Homepage;