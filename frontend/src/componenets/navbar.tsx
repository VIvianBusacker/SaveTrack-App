import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { signOut } from "firebase/auth";
import React, { useState, useEffect, useRef } from "react";
import { MdOutlineClose, MdOutlineKeyboardArrowDown } from "react-icons/md";
import { IoIosMenu } from "react-icons/io";
import { RiCurrencyFill } from "react-icons/ri";
import { auth } from "../libs/firebaseConfig";
import useStore from "../store";
import ThemeSwitch from "./switch";
import { Link, useLocation, useNavigate } from "react-router-dom";



// import TransitionWrapper from "./wrappers/transition-wrapper";

//import ProfileInfo from './profile-info'; // or correct path if different

import { Avatar } from "../assets";
import { FaBars } from "react-icons/fa";

import {
  FaTachometerAlt, // for Dashboard
  FaMoneyCheckAlt, // for Transactions
  FaUserAlt, // for Accounts
  FaCog, // for Settings
} from "react-icons/fa";

// Update links array with icons
const links = [
  { label: "Dashboard", link: "/overview", icon: <FaTachometerAlt /> },
  { label: "Transactions", link: "/transactions", icon: <FaMoneyCheckAlt /> },
  { label: "Accounts", link: "/accounts", icon: <FaUserAlt /> },
  { label: "Settings", link: "/settings", icon: <FaCog /> },
];

const Navbar = () => {
  const location = useLocation();
  const path = location.pathname;
  const [openSidebar, setOpenSidebar] = useState(false);

  const { user, setCredentails } = useStore((state) => state);
  const navigate = useNavigate();

  const [selected, setSelected] = useState(0);
  const [menuVisible, setMenuVisible] = useState(false);
  
  const [profileImage, setProfileImage] = useState(null); // Profile image state


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result; // Base64 image data
        setProfileImage(imageData); // Set profile image
        localStorage.setItem("profileImage", imageData); // Save to localStorage
      };
      reader.readAsDataURL(file);
    }
  };
  
//  ////////////////////////////////////////////////////////////////////
  // Fetch profile image from localStorage on component load
  useEffect(() => {
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
      setProfileImage(savedImage); // Set the profile image from localStorage
    }
  }, []);
  
// SignIn & SignOut ------------------------
  const handleSingout = async () => {
    if (user.provider === "google") {
      await handleSocialLogout();
    }
    localStorage.removeItem("user");
    setCredentails(null);
    navigate("/sign-in");
  };

  const handleSocialLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };
// END OF SignIn & SignOut ------------------------
//  ////////////////////////////////////////////////////////////////////
  const handleBackToDashboard = () => {
    setSelected(0);
    setMenuVisible(false);
  };

  const menuRef = useRef(null); // Reference to the sliding menu

  return (
    <div className="w-full flex items-center justify-between py-4 px-4 md:px-8">

      <div className="flex items-center gap-4">
{/* Hamburger Menu Icon, Logo, and Title on the left */}
<button
        onClick={() => setOpenSidebar(!openSidebar)}
        className="flex items-center rounded-md font-medium focus:outline-none text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-all"
      >
        {openSidebar ? <MdOutlineClose size={26} /> : <IoIosMenu size={26} />}
      </button>

        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-md">
            <img
              className="hover:animate-spin"
              src="src/assets/logo.png"
              alt="Logo"
            />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Save<b>Track</b>
          </h1>
        </div>
      </div>

     
      {openSidebar && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-64 h-full bg-white dark:bg-gray-900 shadow-lg flex flex-col">
            <div className="flex flex-col p-4">
          
































 {/* Profile Image */}
              <div className="flex items-center space-x-4 mb-6">
              {/* <img
                src={Avatar}
                alt="User"
                className="w-14 h-14 rounded-full object-cover cursor-pointer"
              /> */}

          {profileImage ? (
          <img
            src={profileImage}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover cursor-pointer"
          />
        ) : (
          <div className="flex items-center justify-center w-14 h-14 text-white rounded-full bg-blue-500">
            <p className="text-3xl font-bold">{user?.firstname?.charAt(0)}</p>
          </div>
        )}

            
                <div>














































      {/* First letter char(0) => <p className="text-1lx font-bold">{user?.firstname?.charAt(0)}</p> */}
                <p className="text-lx font-medium text-black dark:text-gray-400 items-center px-2">{user?.firstname}</p>

                {/*EMAIL ADRESS <span className="text-sm text-gray-700 dark:text-gray-500">{user?.email}</span> */}

                <Link to="/ManageProfile">   {/*NEED FIXING!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/}
                  <button
                    className={`text-sm text-gray-600 hover:underline mb-4 flex w-full items-center rounded-md px-2 py-2`}
                    onClick={() => setOpenSidebar(false)} >
                     Manage Profile
                  </button>
                </Link>
                </div>
              </div>

            
            
              {links.map(({ label, link, icon }, index) => (
                <Link to={link} key={index}>
                  <button
                key={index}
                className={`${
                  index === selected
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                    : "text-gray-700 dark:text-gray-300"
                } block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg w-full text-left transition-colors duration-300`}
                onClick={() => setSelected(index)}
              >
                {/* :)!!!!!!!!
                <div className="w-full">
                <p className="text-violet-700">{user?.firstname}</p>
                <span className="text-xs overflow-ellipsis">
                  {user?.country}
                </span>
              </div>
            </div> */}


                  {/* <button
                    className={`${
                      link === path
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    } w-full text-left p-4 ctransition-all`}
                    onClick={() => setOpenSidebar(false)} > */}
                 
                 <div className="flex items-center gap-2">
        {icon} {/* Add the icon here */}
        {label}
      </div>
                  </button>
                </Link>
              ))}
              {/* Line */}
              <div style={{
                width: "80%", 
                height: "0.08px", 
                backgroundColor: "#D3D3D3", 
                margin: "10px auto"
              }}></div>

{/* END OF Line */}
 {/* SignOut Button */}
              <div className="py-2">
            <button
                  onClick={handleSingout}
                  className={`text-gray-600 dark:text-white"
                    : "text-gray-700 dark:text-gray-300
                     block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg w-full text-left transition-colors duration-300`}>
                  Sign Out
                </button>
{/* END OF SignOut Button */}
            </div>
            </div>



            {/* <div className="mt-auto p-4">
              <ThemeSwitch />
            </div> */}
          </div>
          <div
            className="w-full h-full bg-black bg-opacity-50"
            onClick={() => setOpenSidebar(false)}
          />
        </div>
      )}
    </div>
  );
};

export default Navbar;
