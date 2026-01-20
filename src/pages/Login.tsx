import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginForm from "../components/forms/LoginForm";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLoginSuccess = (data: { email: string; role: "user" | "admin"; token: string }) => {
    const { token, role } = data;
    login({ role }, token);

    if (role === "admin") {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  return <LoginForm onSuccess={handleLoginSuccess} />;
};

export default Login;
