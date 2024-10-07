import { toast } from "sonner";
import api from "../libs/apiCall";

const ERROR_MESSAGES = {
  networkError: "Network error. Please check your connection.",
  serverError: "Server error. Please try again later.",
  notFound: "Data not found. Please check back later.",
  authFailed: "Authentication failed. Please log in again.",
  default: "Something unexpected happened. Try again later.",
};

const fetchDashboardStats = async (setData, setErrorMessage, setIsLoading, retry = 3) => {
  const URL = `/transaction/dashboard`;
  try {
    const response = await api.get(URL);
    setData(response.data);
    setErrorMessage(null); // Reset any previous errors
  } catch (error) {
    console.error(error);
    let message = ERROR_MESSAGES.default;

    if (error?.response?.status === 404) {
      message = ERROR_MESSAGES.notFound;
    } else if (error?.response?.status === 500) {
      message = ERROR_MESSAGES.serverError;
    } else if (error?.message === "Network Error") {
      message = ERROR_MESSAGES.networkError;
    }

    // Retry on network errors
    if (retry > 0 && error.message === "Network Error") {
      setTimeout(() => fetchDashboardStats(setData, setErrorMessage, setIsLoading, retry - 1), 3000);
    } else {
      toast.error(message);
      setErrorMessage(message);
    }

    // Handle auth failures
    if (error?.response?.data?.status === "auth_failed") {
      localStorage.removeItem("user");
      window.location.reload();
    }
  } finally {
    setIsLoading(false);
  }
};

export default fetchDashboardStats;
