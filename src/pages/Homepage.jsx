import { useSelector } from "react-redux";

const Homepage = () => {
    const { personal, personal_loading } = useSelector((state) => state.users);

    return (
        <section className="mx-9">
            <h1>Homepage</h1>
            {personal_loading ? (
                <p>Loading...</p>
            ) : (
                <section>
                    <p>username: {personal.username}</p>
                    <p>email: {personal.email}</p>
                    <p>gender: {personal.gender}</p>
                    <p>phone: {personal.phone}</p>
                </section>
            )}
        </section>
    )
}

export default Homepage;