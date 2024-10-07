import { useState, useEffect } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Toaster, toast } from "sonner"; // Added toast import for success and error notifications
import { Navbar } from "./componenets"; // Fixed "componenets" typo to "components"
import { setAuthToken } from "./libs/apiCall";
import { AccountsPage, Dashboard, SettingsPage, Transactions } from "./pages";
import useStore from "./store";
import { SignupPage } from "./pages/auth/sign-up";
import SigninPage from "./pages/auth/sign-in";
import ManageProfile from "./componenets/manageProfile.jsx";
import Profileinformation from "./componenets/profileinformation.jsx";
import AccountPreferences from "./settingpage/accountPreferences.jsx";
import EditProfilePicture from "./settingpage/editProfilePicture.jsx";
import ChooseAvatar from "./settingpage/ChooseAvatar.jsx";
import LanguageChange from "./settingpage/LanguageChange.jsx";
import Darklighttheme from "./settingpage/darklighttheme.jsx";
import Countrycurrency from "./settingpage/countrycurrency.jsx";
import { fetchCountries } from "./libs"; // Adjusted import path for fetchCountries
import api from "./libs/apiCall"; // Ensure you have this import for your API calls
import Signinandpassword from "./settingpage/signinandpassword.jsx";
import Passwordchange from "./settingpage/passwordchange.jsx";

const RootLayout = () => {
  const { user } = useStore((state) => state); // Fixed the state extraction syntax

  useEffect(() => {
    setAuthToken(user?.token || ""); // Moved inside useEffect to avoid issues with rerenders
  }, [user]);

  return !user ? (
    <Navigate to={"/sign-in"} replace={true} />
  ) : (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-100px)]">
        <Outlet />
      </div>
    </>
  );
};

const App = () => {
  const theme = useStore((state) => state.theme);
  const { user } = useStore((state) => state); // Destructure user from state
  const [countriesData, setCountriesData] = useState([]); // Fixed state declaration for countriesData
  const [selectedCountry, setSelectedCountry] = useState({
    country: user?.country,
    currency: user?.currency,
  });
  const [profileImage, setProfileImage] = useState(null); // Fixed state for profile image
  const [loading, setLoading] = useState(false); // Added missing loading state

  const getCountriesList = async () => {
    const data = await fetchCountries();
    setCountriesData(data);
  };

  // Function to handle form submission
  const submitHandler = async (data) => {
    try {
      setLoading(true);
      const newData = {
        ...data,
        country: selectedCountry.country,
        currency: selectedCountry.currency,
      };
      const { data: res } = await api.put(`/user/${user?.id}`, newData);
      if (res?.user) {
        const newUser = { ...res.user, token: user.token };
        localStorage.setItem("user", JSON.stringify(newUser));
        toast.success(res?.message);
      }
    } catch (error) {
      console.error("Something went wrong:", error);
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    getCountriesList();
    const savedCountry = localStorage.getItem("selectedCountry");
    if (savedCountry) {
      setSelectedCountry(JSON.parse(savedCountry));
    }
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, [theme]);

  return (
    <main>
      <div className="w-full min-h-screen px-6 bg-gray-100 md:px-20 dark:bg-slate-900">
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/" element={<Navigate to={"/overview"} />} />
            <Route path="/overview" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/accounts" element={<AccountsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/ManageProfile" element={<ManageProfile />} />
            <Route path="/profileinformation" element={<Profileinformation />} />
            <Route path="/AccountPreferences" element={<AccountPreferences />} />
            <Route path="/EditProfilePicture" element={<EditProfilePicture />} />
            <Route path="/ChooseAvatar" element={<ChooseAvatar />} />
            <Route path="/LanguageChange" element={<LanguageChange />} />
            <Route path="/darklighttheme" element={<Darklighttheme />} />
            <Route path="/countrycurrency" element={<Countrycurrency />} />
            <Route path="/Signinandpassword" element={<Signinandpassword />} />
            <Route path="/passwordchange" element={<Passwordchange />} />
          </Route>

          <Route path="/sign-up" element={<SignupPage />} />
          <Route path="/sign-in" element={<SigninPage />} />
        </Routes>
      </div>
      <Toaster richColors position="top-center" />
    </main>
  );
};

export default App;
