import { useState, useEffect } from "react";
import { BsChevronRight } from "react-icons/bs";
import { toast } from "sonner";
import { fetchCountries } from "../libs";
import api from "../libs/apiCall";
import useStore from "../store";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import Button from "../componenets/button";
import InputField from "../componenets/textfield";

import EditProfilePicture from "../settingpage/editProfilePicture";

const LanguageChange = () => {
  const { user, theme, setTheme } = useStore((state) => state);
  const [selectedCountry, setSelectedCountry] = useState({ country: user?.country, currency: user?.currency });
  const [countriesData, setCountriesData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);  // State to control modal visibility
  const [profileImage, setProfileImage] = useState(null); // State for profile image

   // Handle image upload and save to localStorage
   const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result; // Base64 image data
        setProfileImage(imageData); // Update state with the image
        localStorage.setItem('profileImage', imageData); // Store the image in localStorage
      };
      reader.readAsDataURL(file);
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

  const toggleTheme = (val) => {
    setTheme(val);
    localStorage.setItem("theme", val);
  };

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

  const ProfileInfo = () => (
    <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-6 mb-6">
      <p className="text-xl font-bold dark:text-white">Language</p>
        <p className="py-1 text-gray-700">Select the language you use on SaveTrack</p>
      <div className="flex items-center space-x-4 mt-4">
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
    
    
      
      
      {/*Language Information */}
      <div className="w-28 md:w-40">
                <select className="inputStyles">
                  <option value="English">English</option>
                </select>
              </div>
      </div>





   














        <div className="flex justify-end gap-4">
          <Button type="reset" label="Reset" className="px-6 bg-transparent text-black dark:text-white border border-gray-200 dark:border-gray-700 rounded-md" />
          <Button loading={loading} type="submit" label="Save" className="px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-md" />
        </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="w-3/4 p-8">
        <ProfileInfo />
      </div>
    </div>
  );
};

export default LanguageChange;
