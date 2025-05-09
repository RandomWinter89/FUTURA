import { useNavigate } from "react-router-dom";

const FailedPage = () => {
    const navigate = useNavigate();

    return (
      <main className="m-4 h-[85svh] flex flex-col justify-center items-center gap-6">
        <h1>Payment Cancelled</h1>

        <button 
          onClick={() => navigate("/Checkout")}
          className="border border-black py-2 px-8 rounded-xl hover:bg-black hover:text-white"
        >
          Return to homepage
        </button>
      </main>
    );
}

export default FailedPage;