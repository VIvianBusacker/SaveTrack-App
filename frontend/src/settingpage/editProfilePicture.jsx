import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../store";

const EditProfilePicture = ({ profileImage, onClose, onImageChange }) => {
  const [avatar, setAvatar] = useState(profileImage);
  const { user } = useStore((state) => state);
  const navigate = useNavigate(); // Use navigate to go to ChooseAvatar component

  useEffect(() => {
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
      setAvatar(savedImage); // Load the image from localStorage if it exists
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 w-96 text-center relative shadow-lg">
        {/* Close Button */}
        <button className="absolute top-4 right-4 text-2xl font-semibold" onClick={onClose}>
          &times;
        </button>

        {/* Title */}
        <h2 className="text-xl font-bold mb-4">Change photo</h2>

        {/* User Help Text */}
        <p className="text-lg mb-4">
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            {user?.firstname} {user?.lastname}
          </span>
        </p>

        {/* Profile Image */}
        <div className="flex justify-center mb-4">
          {avatar ? (
            <img
              src={avatar}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-300">
              <div className="flex items-center justify-center w-full h-full text-white bg-blue-500 rounded-full">
                <p className="text-2xl font-bold">S</p>  {/* Placeholder for user initial */}
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <p className="text-sm text-gray-500 mb-8">
          Let others know about you! Upload a photo of yourself. Then crop, filter, and adjust it to perfection.
        </p>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-2">
          {/* Choose Avatar Button */}
          <button
            className="px-4 py-2 text-sm font-semibold text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-50"
            onClick={() => navigate("/ChooseAvatar")} // Navigate to ChooseAvatar component
          >
            Choose Avatar
          </button>

          {/* Upload Photo Button */}
          <label className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 cursor-pointer">
            Upload photo
            <input
              type="file"
              accept="image/*"
              onChange={onImageChange}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePicture;
