import { useState, useEffect } from "react";
import { IoMoonOutline } from "react-icons/io5";
import { LuSunMoon } from "react-icons/lu";
import useStore from "../store";

const ThemeSwitch = () => {
  const { theme, setTheme } = useStore((state) => state);
  const [isDarkMode, setIsDarkMode] = useState(theme === "dark");

  // On initial render, sync with localStorage theme if it exists
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    setIsDarkMode(savedTheme === "dark");
  }, [setTheme]);

  const toggleTheme = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setIsDarkMode(!isDarkMode);
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <button onClick={toggleTheme} className="outline-none">
      {isDarkMode ? (
        <LuSunMoon size={26} className="text-gray-500" />
      ) : (
        <IoMoonOutline size={26} className="" />
      )}
    </button>
  );
};

export default ThemeSwitch;
