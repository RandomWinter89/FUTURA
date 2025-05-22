import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui";

const FailedPage = () => {
    const navigate = useNavigate();

    return (
      <div className="flex-1 flex flex-col justify-center items-center gap-6">
        <h1>Payment Cancelled</h1>

        <Button onClick={() => navigate("/Shop/Homepage")} state={"fit"}>
          Return to homepage
        </Button>
      </div>
    );
}

export default FailedPage;