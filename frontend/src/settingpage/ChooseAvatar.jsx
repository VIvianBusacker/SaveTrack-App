import React from "react";
import { useNavigate } from "react-router-dom";

// Assuming the avatar images are stored in the assets folder
import avatar1 from "../assets/avatar1.png";
import avatar2 from "../assets/avatar2.png";
import avatar3 from "../assets/avatar3.png"; // Add more as needed
import avatar4 from "../assets/avatar4.png";
const avatars = [avatar1, avatar2, avatar3, avatar4]; // List of avatars

const ChooseAvatar = () => {
  const navigate = useNavigate();

  // Function to handle avatar selection
  const handleAvatarSelect = (avatar) => {
    localStorage.setItem("profileImage", avatar); // Save the selected avatar in localStorage
    navigate(-1); // Go back to the previous screen (EditProfilePicture)
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-semibold mb-6">Choose an Avatar</h2>

      <div className="grid grid-cols-3 gap-4">
        {avatars.map((avatar, index) => (
          <div
            key={index}
            className="w-24 h-24 cursor-pointer border-2 border-gray-300 rounded-full overflow-hidden hover:border-blue-500"
            onClick={() => handleAvatarSelect(avatar)}
          >
            <img
              src={avatar}
              alt={`Avatar ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Back Button */}
      <button
        className="mt-8 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        onClick={() => navigate(-1)} // Navigate back to EditProfilePicture without selection
      >
        Cancel
      </button>
    </div>
  );
};

export default ChooseAvatar;
