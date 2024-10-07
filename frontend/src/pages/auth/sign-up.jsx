import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BiLoader, BiShow, BiHide } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as z from "zod";
import logo from "../../assets/logo.png"; // Import the logo

import { Separator } from "../../componenets/separator";
import { SocialAuth } from "../../componenets/social-auth";
import { Button } from "../../componenets/ui/button";
import api from "../../libs/apiCall";
import useStore from "../../store";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../componenets/ui/card";

const RegisterSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email address" }),
  firstName: z
    .string({ required_error: "Name is required" })
    .min(3, "Name must be at least 3 characters"),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters"),
});

export const SignupPage = () => {
  const { user } = useStore((state) => state);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(RegisterSchema),
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Track focused and filled status for input fields
  const [focusedField, setFocusedField] = useState({
    name: false,
    email: false,
    password: false,
  });

  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const { data: res } = await api.post("/auth/sign-up", data);
  
      if (res?.user) {
        toast.success(res?.message);
  
        // Store user info in localStorage
        const userInfo = { ...res.user, token: res.token };
        localStorage.setItem("user", JSON.stringify(userInfo));
  
        // Store user credentials in your global store
        setCredentails(userInfo); // Ensure `setCredentails` updates the store
  
        // Navigate to home page
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch (error) {
      console.error("Something went wrong:", error);
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    if (user) {
      navigate("/"); // Navigate to home if user exists
    }
  }, [user, navigate]);

  // Helper function to style input based on its state
  const getInputStyles = (field) => {
    const isFieldFocusedOrFilled = focusedField[field] || register(field).value;
    return `w-full px-3 py-2 text-sm border rounded-md ${
      isFieldFocusedOrFilled
        ? "border-transparent" // No border when focused or filled
        : "border-gray-300"    // Gray border when not focused or empty
    } ${
      errors[field] ? "border-red-500" : ""
    } dark:border-gray-700 dark:bg-transparent dark:placeholder-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {/* Logo centered at the top */}
      <img
        src={logo}
        alt="Logo"
        className="mb-6 w-24 h-24 object-contain" // Adjust size and margin for spacing
      />

      {/* Form Card */}
      <Card className="w-[400px] bg-white dark:bg-black/20 rounded-lg shadow-md overflow-hidden">
        <div className="p-6 md:p-8">
          <CardHeader className="py-0">
            <CardTitle className="mb-8 text-center dark:text-white">
              Create an account
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="mb-8 space-y-6">
                <SocialAuth isLoading={loading} setLoading={setLoading} />
                <Separator />

                {/* Full Name Field */}
                <div className="relative">
                  <label
                    className={`absolute left-3 transition-all duration-300 transform bg-white px-1 text-gray-500 ${
                      focusedField.name || register("firstName").value
                        ? "text-xs top-[-10px] left-1"
                        : "top-[50%] -translate-y-1/2 text-sm"
                    } dark:text-gray-400`}
                  >
                    Full Name
                  </label>
                  <input
                    disabled={loading}
                    id="firstName"
                    type="text"
                    className={getInputStyles("firstName")}
                    {...register("firstName")}
                    onFocus={() =>
                      setFocusedField((prev) => ({ ...prev, name: true }))
                    }
                    onBlur={(e) =>
                      setFocusedField((prev) => ({
                        ...prev,
                        name: e.target.value !== "",
                      }))
                    }
                  />
                  {errors.firstName && (
                    <p className="text-xs text-red-500">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div className="relative">
                  <label
                    className={`absolute left-3 transition-all duration-300 transform bg-white px-1 text-gray-500 ${
                      focusedField.email || register("email").value
                        ? "text-xs top-[-10px] left-1"
                        : "top-[50%] -translate-y-1/2 text-sm"
                    } dark:text-gray-400`}
                  >
                    Email Address
                  </label>
                  <input
                    disabled={loading}
                    id="email"
                    type="email"
                    className={getInputStyles("email")}
                    {...register("email")}
                    onFocus={() =>
                      setFocusedField((prev) => ({ ...prev, email: true }))
                    }
                    onBlur={(e) =>
                      setFocusedField((prev) => ({
                        ...prev,
                        email: e.target.value !== "",
                      }))
                    }
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Field with Show/Hide functionality */}
                <div className="relative">
                  <label
                    className={`absolute left-3 transition-all duration-300 transform bg-white px-1 text-gray-500 ${
                      focusedField.password || register("password").value
                        ? "text-xs top-[-10px] left-1"
                        : "top-[50%] -translate-y-1/2 text-sm"
                    } dark:text-gray-100`}
                  >
                    Password
                  </label>
                  <input
                    disabled={loading}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className={getInputStyles("password")}
                    {...register("password")}
                    onFocus={() =>
                      setFocusedField((prev) => ({
                        ...prev,
                        password: true,
                      }))
                    }
                    onBlur={(e) =>
                      setFocusedField((prev) => ({
                        ...prev,
                        password: e.target.value !== "",
                      }))
                    }
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <BiHide /> : <BiShow />}
                  </button>
                  {errors.password && (
                    <p className="text-xs text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-violet-800 dark:bg-violet-700 hover:bg-violet-900"
                disabled={loading}
              >
                {loading ? (
                  <BiLoader className="text-2xl text-white animate-spin mx-auto" />
                ) : (
                  "Create account"
                )}
              </Button>
            </form>
          </CardContent>
        </div>
        <CardFooter className="justify-center gap-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?
          </p>
          <Link
            to="/sign-in"
            className="text-sm font-semibold text-violet-600 dark:text-violet-400 hover:underline"
          >
            Sign in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};
