import { useDispatch } from "react-redux";
import {
  register,
  login,
  logout,
  recentVerifiedEmail,
  getMe,
} from "../service/auth.api";
import {
  setUser,
  setLoading,
  setError,
} from "../states/authSlice";
import { toast } from "react-toastify";

export const useAuth = () => {
  const dispatch = useDispatch();

const handleRegister = async ({ username, email, password }) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));

    await register({ username, email, password });

    toast.success("Registration successful! ✅", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.errors?.[0]?.msg ||
      "Registration failed. Please try again.";

    toast.error(message, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    dispatch(setError(message));

  } finally {
    dispatch(setLoading(false));
  }
};

  const handleLogin = async ({ email, password }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await login({ email, password });
      dispatch(setUser(response.user));

      toast.success("Login successful! ✅", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.[0]?.msg ||
        "Login failed. Please try again.";

      toast.error(message, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      dispatch(setError(message));

    } finally {
      dispatch(setLoading(false));
    }
  };

  
  const handleLogout = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      await logout();
      dispatch(setUser(null));

      toast.success("Logout successful ✅", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

    } catch (error) {
      const message = error?.message || "Logout failed";

      toast.error(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      dispatch(setError(message));

    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleRecentVerifiedEmail = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await recentVerifiedEmail();
      return response.email;

    } catch (error) {
      const message = error?.message || "Failed to fetch email";

      toast.error(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      dispatch(setError(message));

    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleGetMe = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await getMe();
      console.log(response);
      dispatch(setUser(response.user));

    } catch (error) {
      const message = error?.message || "Failed to fetch user data";
      dispatch(setError(message));
      
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    handleRegister,
    handleLogin,
    handleLogout,
    handleRecentVerifiedEmail,
    handleGetMe,
  };
};
