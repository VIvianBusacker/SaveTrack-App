import { useState, useEffect } from "react";
import { BsChevronRight } from "react-icons/bs";
import { toast } from "sonner";
import { fetchCountries } from "../libs";
import api from "../libs/apiCall";
import useStore from "../store";
import { Link } from "react-router-dom";
import EditProfilePicture from "../settingpage/editProfilePicture";

const AccountPreferences = () => {
  const { user, theme, setTheme } = useStore((state) => state);
  const [selectedCountry, setSelectedCountry] = useState({ country: user?.country, currency: user?.currency } || "");
  const [query, setQuery] = useState("");
  const [countriesData, setCountriesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null); // State for profile image
  const [avatar, setAvatar] = useState(null); // Declare avatar state
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

  // Function to toggle the theme
  const toggleTheme = (val) => {
    setTheme(val);
    localStorage.setItem("theme", val);
  };

  // Fetch country data on component mount
  const getCountriesList = async () => {
    const data = await fetchCountries();
    setCountriesData(data);
  };

  useEffect(() => {
    getCountriesList();
    const savedCountry = localStorage.getItem('selectedCountry');
    if (savedCountry) {
      setSelectedCountry(JSON.parse(savedCountry)); // Load saved country and currency from localStorage
    }const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
      setProfileImage(savedImage); // Load the image from localStorage if it exists
    }     
  }, []);


  
  // Sidebar component for settings navigation
  const Sidebar = () => (
    <div className="w-1/4 bg-gray-100 dark:bg-gray-800 p-6">
      <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">Settings</h2>
      <ul className="space-y-6">
      <SidebarItem label="Account Preferences" to="/AccountPreferences" />
        <SidebarItem label="Sign in & Security" to="/signinandpassword" />
        <SidebarItem label="Appearance" to="/darklighttheme" />
        <SidebarItem label="Finance Exchange" to="/countrycurrency" />
        {/* <SidebarItem label="Advertising Data" to="/manageprofile" />
        <SidebarItem label="Notifications" to="/manageprofile" /> */}
      </ul>
    </div>
  );

  // SidebarItem for navigable links
  const SidebarItem = ({ label, to }) => (
    <Link to={to} className="block text-base font-medium text-gray-600 dark:text-gray-400 hover:text-blue-500 transition">
      {label}
    </Link>
  );

  // Profile Info component for displaying user profile information
  const Profileinformation = () => (
    <Link to="/Profileinformation">
      <SectionWrapper title="Profile Information" description="Name, phone number, and email address" />
    </Link>
  );

  // Display Section for user display preferences
  const Language = () => (
    <Link to="/LanguageChange">
      <SectionWrapper title="Language" />
    </Link>
  );

  // General preferences section with user settings
  const GeneralPreferences = () => (
    <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-4 mb-6">
      <p className="text-lg font-semibold dark:text-white">General Preferences</p>
      <div className="mt-4">
        <PreferenceItem title="Language" value="English" />
        <PreferenceItem title="Theme" value={theme === "dark" ? "Dark" : "Light"} /> {/* Dynamically set the theme */}
        <PreferenceItem title="Country" value={selectedCountry?.country || "Not Set"} /> {/* Dynamically set the country */}
        <PreferenceItem title="Currency" value={selectedCountry?.currency || "Not Set"} /> {/* Dynamically set the currency */}
        {/* <PreferenceItem title="Autoplay Videos" value="On" /> */}
        {/* <PreferenceItem title="Sound Effects" value="On" /> */}
        {/* <PreferenceItem title="Showing Profile Photos" value="Your Network" /> */}
        {/* <PreferenceItem title="Preferred Feed View" value="Most Relevant Posts" /> */}
      </div>
    </div>
  );

  // Reusable component for displaying preference items
  const PreferenceItem = ({ title, value }) => (
    <div className="flex justify-between mb-2">
      <span className="text-sm text-gray-500 dark:text-gray-400">{title}</span>
      <span className="dark:text-white">{value}</span>
    </div>
  );

  // Wrapper component for sections with title and description
  const SectionWrapper = ({ title, description }) => (
    <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-4 mb-6 flex justify-between items-center">
      <div>
        <p className="text-lg font-semibold dark:text-white">{title}</p>
        {description && <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>}
      </div>
      <BsChevronRight className="text-gray-400 dark:text-gray-500" />
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="w-3/4 p-6">
        <Profileinformation />
        <Language />
        <GeneralPreferences />
      </div>
    </div>
  );
};

export default AccountPreferences;
