import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FcGoogle } from "react-icons/fc"; // Google icon
import { toast } from "sonner"; // Toast notification library
import { useNavigate } from "react-router-dom";
import api from "../libs/apiCall";
import { auth } from "../libs/firebaseConfig"; // Firebase config
import useStore from "../store";
import { Button } from "./ui/button"; // Your button component

export const SocialAuth = ({ isLoading, setLoading }) => {
  const [user] = useAuthState(auth); // Firebase auth state hook
  const [selectedProvider, setSelectedProvider] = useState("google");
  const { setCredentails } = useStore((state) => state);
  const navigate = useNavigate();

  // Google sign-in
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    setSelectedProvider("google");
    try {
      setLoading(true);
      const res = await signInWithPopup(auth, provider);
      toast.success("Signed in successfully with Google");
    } catch (error) {
      console.error("Error signing in with Google", error);
      toast.error("Error signing in with Google. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // GitHub sign-in (optional)
  const signInWithGithub = async () => {
    const provider = new GithubAuthProvider();
    setSelectedProvider("github");
    try {
      setLoading(true);
      const res = await signInWithPopup(auth, provider);
      toast.success("Signed in successfully with GitHub");
    } catch (error) {
      console.error("Error signing in with GitHub", error);
      toast.error("Error signing in with GitHub. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Save user info to backend
  useEffect(() => {
    const saveUserToDb = async () => {
      try {
        const userData = {
          name: user.displayName,
          email: user.email,
          provider: selectedProvider,
          uid: user.uid,
        };

        setLoading(true);
        const { data: res } = await api.post("/auth/sign-in", userData);
        if (res?.user) {
          toast.success(res?.message);
          const userInfo = { ...res?.user, token: res?.token };
          localStorage.setItem("user", JSON.stringify(userInfo));
          setCredentails(userInfo);
          setTimeout(() => {
            navigate("/overview");
          }, 1500);
        }
      } catch (error) {
        console.error("Something went wrong while saving user:", error);
        toast.error(error?.response?.data?.message || "Failed to sign in. Try again.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      saveUserToDb(); // Save user info if the user is authenticated
    }
  }, [user?.uid]);

  return (
    <div className="flex items-center gap-2">
      {/* Google Sign-in Button */}
      <Button
        onClick={signInWithGoogle}
        disabled={isLoading}
        variant="outline"
        className="w-full text-sm font-normal dark:bg-transparent dark:border-gray-800 dark:text-gray-400"
        type="button"
      >
        <FcGoogle className="mr-2 size-5" />
        Continue with Google
      </Button>

      {/* Uncomment this button to enable GitHub sign-in */}
      {/* 
      <Button
        onClick={signInWithGithub}
        disabled={isLoading}
        variant="outline"
        type="button"
        className="w-full text-sm font-normal dark:bg-transparent dark:border-gray-800 dark:text-gray-400"
      >
        <FaGithub className="mr-2 size-4" />
        Continue with GitHub
      </Button> 
      */}
    </div>
  );
};
