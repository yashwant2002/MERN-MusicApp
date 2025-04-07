import { useNavigate } from "react-router-dom";

const Logo = () => {
  const navigate = useNavigate();
  return (
    <div className="cursor-pointer" onClick={() => navigate("/")}>
      <img className="h-10 w-20" src="/logo.png" />
    </div>
  );
};

export default Logo;
