import { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "../libs/apiCall"; // Your API call functions
import useStore from "../store";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import Button from "../componenets/button";

import { IoMoonOutline } from "react-icons/io5";
import { LuSunMoon } from "react-icons/lu";

// Mocked backend data - ideally, this would come from an API
const fetchThemeData = async () => {
  // This should be an actual API call that fetches theme details from the backend
  return [
    { id: 1, name: 'Light', backgroundColor: "#f0f0f0", textColor: "#000" },
    { id: 2, name: 'Dark', backgroundColor: "#2c2c2c", textColor: "#fff" },
    // { id: 1, name: 'Light default', backgroundColor: "#f0f0f0", textColor: "#000" },
    // { id: 2, name: 'Light high contrast', backgroundColor: "#ffffff", textColor: "#000" },
    // { id: 3, name: 'Light Tritanopia', backgroundColor: "#d3d3d3", textColor: "#000" },
    // { id: 4, name: 'Light Protanopia & Deuteranopia', backgroundColor: "#fff8e1", textColor: "#000" },
    // { id: 5, name: 'Dark default', backgroundColor: "#2c2c2c", textColor: "#fff" },
    // { id: 6, name: 'Dark high contrast', backgroundColor: "#000000", textColor: "#fff" },
    // { id: 7, name: 'Dark Tritanopia', backgroundColor: "#37474f", textColor: "#fff" },
    // { id: 8, name: 'Dark Protanopia & Deuteranopia', backgroundColor: "#424242", textColor: "#fff" },
    // { id: 9, name: 'Dark dimmed', backgroundColor: "#1e1e1e", textColor: "#fff" },
    // { id: 10, name: 'Baby blue', backgroundColor: "#ADD8E6", textColor: "#000" }, // Added baby blue theme
  
 ];
};

const DarkLightTheme = () => {
  const { user, theme, setTheme } = useStore((state) => state);
  const [selectedCountry, setSelectedCountry] = useState({ country: user?.country, currency: user?.currency });
  const [countriesData, setCountriesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [themes, setThemes] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState(theme === "dark" ? "Dark default" : "Light default");
  const [isDarkMode, setIsDarkMode] = useState(theme === "dark");
  const [profileImage, setProfileImage] = useState(null); // State for profile image

  // Sync with localStorage theme if it exists on initial load
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    setIsDarkMode(savedTheme === "dark");
    document.documentElement.setAttribute("data-theme", savedTheme); // Update global root theme
  }, [setTheme]);
 const getCountriesList = async () => {
    const data = await fetchCountries();
    setCountriesData(data);
  };
  
  useEffect(() => {
    // Fetch theme data from backend
    const getThemes = async () => {
      const themeData = await fetchThemeData();
      setThemes(themeData);
    };
    getThemes();
    getCountriesList();
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
      setProfileImage(savedImage); // Load the image from localStorage if it exists
    }
  }, []);

  const toggleTheme = (themeName) => {
    const selectedTheme = themes.find(theme => theme.name === themeName);
    if (selectedTheme) {
      const newTheme = themeName.includes('Dark') ? "dark" : "light";
      setSelectedTheme(themeName);
      setTheme(newTheme);
      localStorage.setItem("theme", newTheme);
      document.documentElement.setAttribute("data-theme", newTheme); // Update global root theme
      toast.success(`${themeName} applied successfully!`);
    }
  };

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { ...user },
  });

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

  const SidebarItem = ({ label, to }) => (
    <Link to={to} className="block text-base font-medium text-gray-600 dark:text-gray-400 hover:text-blue-500 transition" aria-label={label}>
      {label}
    </Link>
  );

  const ThemeSelector = () => (
    <div>
      <p className="text-lg mb-4">Choose your theme preference:</p>
      <div className="grid grid-cols-2 gap-4">
        {themes.map((themeOption) => (
          <div
            key={themeOption.id}
            style={{
              backgroundColor: themeOption.backgroundColor,
              color: themeOption.textColor,
              border: selectedTheme === themeOption.name ? "2px solid blue" : "1px solid gray",
              padding: "10px",
              borderRadius: "10px",
              cursor: "pointer",
              height: "100px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            onClick={() => toggleTheme(themeOption.name)}
          >
            <p>{themeOption.name}</p>
            <input
              type="radio"
              name="theme"
              value={themeOption.name}
              checked={selectedTheme === themeOption.name}
              onChange={() => toggleTheme(themeOption.name)}
            />
            {selectedTheme === themeOption.name && (
              <p className="text-sm text-blue-500 mt-2">Currently selected</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
  

  const ProfileInfo = () => (
    <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-6 mb-6">
      <p className="text-xl font-bold dark:text-white">Theme Preferences</p>
      <p className="py-1 text-gray-700 dark:text-gray-300">Choose how your experience looks for this device. Selections are applied immediately and saved automatically.</p>
      <ThemeSelector />
      {/* <div className="flex justify-end gap-4 mt-6">
        <Button type="reset" label="Reset" className="px-6 bg-transparent text-black dark:text-white border border-gray-200 dark:border-gray-700 rounded-md" />
        <Button loading={loading} type="submit" label="Save" className="px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-lg" />
      </div> */}
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-500">
      <Sidebar />
      <div className="w-3/4 p-8">
        <ProfileInfo />
      </div>
    </div>
  );
};

export default DarkLightTheme;
