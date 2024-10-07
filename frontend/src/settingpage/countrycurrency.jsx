import {
    Combobox,
    ComboboxButton,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions,
    Transition,
  } from "@headlessui/react";
  
import { Fragment, useState, useEffect } from "react";
import { BsChevronRight } from "react-icons/bs";
import { toast } from "sonner";
import { fetchCountries } from "../libs";
import api from "../libs/apiCall";
import useStore from "../store";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import Button from "../componenets/button";
import InputField from "../componenets/textfield";

import { BiCheck } from "react-icons/bi";
import { BsChevronExpand } from "react-icons/bs";

import EditProfilePicture from "../settingpage/editProfilePicture";

const Countrycurrency = () => {
  const { user, theme, setTheme } = useStore((state) => state);
  const [selectedCountry, setSelectedCountry] = useState({
    country: user?.country,
    currency: user?.currency,
  });  const [countriesData, setCountriesData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);  // State to control modal visibility
  const [profileImage, setProfileImage] = useState(null); // State for profile image

  const [query, setQuery] = useState("");


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

  
  const filteredCountries =
  query === ""
    ? countriesData
    : countriesData.filter((country) =>
        country.country
          .toLowerCase()
          .replace(/\s+/g, "")
          .includes(query.toLowerCase().replace(/\s+/g, ""))
      );

 // Load countries list and check if there's a saved country in localStorage
 const getCountriesList = async () => {
    const data = await fetchCountries();
    setCountriesData(data);
  };


  useEffect(() => {
    getCountriesList();
      const savedCountry = localStorage.getItem('selectedCountry');
      if (savedCountry) {
        setSelectedCountry(JSON.parse(savedCountry)); // Load saved country and currency from localStorage
      }
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
      setProfileImage(savedImage); // Load the image from localStorage if it exists
    }
  }, []);
  
    // Function to handle country selection and automatically update the currency
    const handleCountrySelection = (country) => {
        const selectedCurrency = country.currency; // Assuming country object contains currency info
        const updatedCountry = {
          country: country.country,
          currency: selectedCurrency,
        };
        setSelectedCountry(updatedCountry);
        localStorage.setItem('selectedCountry', JSON.stringify(updatedCountry)); // Save selected country and currency to localStorage
        toast.success(`You are in ${country.country} and your currency is ${selectedCurrency}`);
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

  const Countries = () => (
    <div className="relative mt-2">
      <Combobox value={selectedCountry} onChange={handleCountrySelection}>
        <div className="relative w-full">
          <ComboboxInput
            className="inputStyles"
            displayValue={(country) => country?.country}
            onChange={(e) => setQuery(e.target.value)}
          />
          <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
            <BsChevronExpand className="text-gray-400" />
          </ComboboxButton>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery('')}
        >
          <ComboboxOptions className="absolute z-110 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-slate-900 py-1 shadow-lg ring-1 ring-black/5">
            {filteredCountries.length === 0 && query !== "" ? (
              <div className="relative cursor-default select-none px-4 py-2 text-gray-700 dark:text-gray-500">
                Nothing found.
              </div>
            ) : (
              filteredCountries.map((country, index) => (
                <ComboboxOption
                  key={country.country + index}
                  value={country}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? "bg-violet-600/20 text-white" : "text-gray-900"}`
                  }
                >
                  {({ selected, active }) => (
                    <>
                      <div className="flex items-center gap-2">
                        <img
                          src={country.flag}
                          alt={country.country}
                          className="w-8 h-5 rounded-sm object-cover"
                        />
                        <span className={`block truncate ${selected ? "font-semibold" : "font-normal"}`}>
                          {country.country}
                        </span>
                      </div>
                      {selected && (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? "text-white" : "text-teal-600"}`}
                        >
                          <BiCheck className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </ComboboxOption>
              ))
            )}
          </ComboboxOptions>
        </Transition>
      </Combobox>
    </div>
  );

  const ProfileInfo = () => (
    <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-6 mb-6">
      <p className="text-xl font-bold dark:text-white">Exchange</p>
        <p className="py-1 text-gray-700">Select the country and currency you use on SaveTrack. Selections are applied immediately and saved automatically.</p>
      <div className="flex items-center space-x-4 mt-4">
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
    
    
      
      
      {/*Lanuage and currency Information */}
      {/* <div className="w-28 md:w-40"> */}
               <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
       <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-6">

          {/* <span className="labelStyles">Country</span>
          <Countries /> */}
          <span className="labelStyles">Country</span>
          <select className="inputStyles">
  <option value="USA">United State of America</option>
</select>

          <span className="labelStyles">Currency</span>
          <input
            className="inputStyles"
            value="USD" // Fixed currency
            disabled
          />
</div>
      </div>

      </div>



   














        {/* <div className="flex justify-end gap-4 py-5">
          <Button type="reset" label="Reset" className="px-6 bg-transparent text-black dark:text-white border border-gray-200 dark:border-gray-700 rounded-md" />
          <Button loading={loading} type="submit" label="Save" className="px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-md" />
        </div> */}
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

export default Countrycurrency;
