'use client';

import React, { useState, useEffect } from "react";
import {AuthAPI} from "../../utils/api";
import { useRouter, useSearchParams } from "next/navigation";
import { AiOutlineEye, AiOutlineEyeInvisible, AiFillExclamationCircle } from "react-icons/ai";
import { ToastContainer, toast } from 'react-toastify';

const floatAnimation = `
  @keyframes float {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-5px);
    }
    100% {
      transform: translateY(0px);
    }
  }
`;
const pulsateAnimation = `
  @keyframes pulsateBg {
    0% {
      background-size: 35%;
    }
    50% {
      background-size: 50%;
    }
    100% {
      background-size: 35%;
    }
  }

  .bg-pulsate {
    animation: pulsateBg 8s ease-in-out infinite;
  }
`;

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: "", password: "", username: "", repeatPassword: ""});
  const [errorMessage, setErrorMessage] = useState<string>(''); // Add this line
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);

  //reset password
  const searchParams = useSearchParams();
  const [isResetPassword, setIsResetPassword] = useState(!!searchParams.get('isReset'));
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const [emailReset, setEmailReset] = useState('');
  const isReset = searchParams.get('isReset');
  const isVerify = searchParams.get('isVerify') === 'true';

  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const resetFormFields = () => {
    setFormData({ email: "", password: "", username: "", repeatPassword: "" });
    setEmailReset('');
    setShowPassword(false);
    setShowRepeatPassword(false);
    setErrorMessage('');
  };
  useEffect(() => {
    if (isVerify) {
      handleVerifyEmail();
    }
    }, [isVerify]);
    
  const handleVerifyEmail = async () => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    console.log(token, email);
    try {
      const response = await AuthAPI.post('/verify-email', {
        email: email,
        token: token
      });
      console.log(response);
      toast.success(response.data.message);
      setTimeout(() => router.push('/'), 3000);
    } catch (error) {
      console.error(error);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mounted || isSendingCode) return;
    
    try {
      setIsSendingCode(true);
      setErrorMessage(''); 
      const { data } = await AuthAPI.post('/reset-password', {
        email: emailReset,
      });
      toast.info('Password reset link sent to your email!');
      setIsResetPassword(false);
      setIsLogin(true);
    } catch (error: any) {
      console.error('Reset Error:', error);
      toast.error(error.response?.data?.message || 'Password reset email could not be sent.');
      // setErrorMessage(error.response?.data?.message || 'Password reset email could not be sent.');
    } finally {
      setIsSendingCode(false);
    }
  };

  const handlePasswordResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mounted || isResetting) return;

    try {
      setIsResetting(true);
      if (newPassword !== confirmNewPassword) {
        // setErrorMessage('Passwords do not match');
        toast.error('Passwords do not match');
        return;
      }

      if (newPassword.length < 8 || /\s/.test(newPassword)) {
        // setErrorMessage('Password must be at least 8 characters long and cannot contain spaces');
        toast.error('Password must be at least 8 characters long and cannot contain spaces');
        return;
      }

      setErrorMessage('');
      const { data } = await AuthAPI.post('/reset-password/verify', {
        email,
        token,
        newPassword
      });
      toast.success('Password reset successfull!');
      setTimeout(() => router.push('/'), 3000);
    } catch (error: any) {
      console.error('Reset Error:', error);
      toast.error(error.response?.data?.message || 'Password reset failed');
      // setErrorMessage(error.response?.data?.message || 'Password reset failed');
    } finally {
      setIsResetting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mounted || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setErrorMessage(''); 
      if (isLogin) {
        const { data } = await AuthAPI.post('/login', formData);
        localStorage.setItem('token', data.token);
        localStorage.setItem('userEmail', data.user.email);
        localStorage.setItem('userName', data.user.username);
        toast.success('Login successful!');
        setTimeout(() => router.push('/Dashboard'), 1000);
      } else {
        if (formData.password !== formData.repeatPassword) {
          // setErrorMessage('Passwords do not match');
          toast.error('Passwords do not match');
          return;
        }
        if (formData.password.length < 8 || /\s/.test(formData.password)) {
          // setErrorMessage('Password must be at least 8 characters long and cannot contain spaces');
          toast.error('Password must be at least 8 characters long and cannot contain spaces');
          return;
        }
        const { data } = await AuthAPI.post('/signup', formData);
        if (data.status === 'success') {
          // alert(data.message);
          toast.success(data.message);
          setIsLogin(true);
        } else {
          // setErrorMessage(data.message);
          toast.error(data.message);
        }
      }
    } catch (error: any) {
      console.error('Auth Error:', error);
      // setErrorMessage(error.response?.data?.message || 'Authentication failed');
      toast.error(error.response?.data?.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex flex-row items-center justify-center min-h-screen w-full">
      {/* Add the style tag for the animation */}
      <style>{floatAnimation}</style>
      <style>{pulsateAnimation}</style>
      {/* LEFT PANEL (Positioned Absolutely) */}
      <div className="absolute left-0 top-0 h-full w-full bg-[url('/bg.svg')] bg-contain bg-no-repeat bg-left-bottom z-10 bg-pulsate">
      </div>

      {/* RIGHT PANEL (Slightly Overlapping) */}
      <div className="flex flex-row items-center justify-center w-full">
        <div className="relative flex flex-col items-center justify-center space-y-4 min-h-screen w-full bg-transparent dark:bg-transparent bg-none ml-auto z-20 px-10 md:px-60
          // small
          md:items-end
          ">
          {/* LOGO */}
          <img src="/metatown.png" alt="Metatown" width={250} height={150} className="absolute z-99 top-10 mx-auto md:pt-12 md:pr-24 md:top-0 md:right-0"/>

          {/* Update both form containers with animation */}
          {isReset ? (
            <form onSubmit={handlePasswordResetSubmit} className="cursor-pointer flex flex-col gap-4 w-full max-w-sm p-6 rounded-lg shadow-lg bg-white hover:shadow-2xl transition-all duration-300" style={{ animation: 'float 3s ease-in-out infinite' }}>
              <h1 className="text-4xl font-bold mb-4 text-left text-[#BB30C9]">Reset Password</h1>
              {errorMessage && (
                <p className="bg-[#FF4C4C] text-white text-justify rounded-2xl p-4 flex items-center gap-2">
                  <AiFillExclamationCircle size={24} />
                  {errorMessage}
                </p>
              )}
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="border-2 border-[#656572] bg-transparent rounded-lg p-3 text-black pl-6 w-full"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showNewPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmNewPassword"
                  placeholder="Confirm New Password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="border-2 border-[#656572] bg-transparent rounded-lg p-3 text-black pl-6 w-full"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                </button>
              </div>
              <button 
                type="submit" 
                disabled={isResetting}
                className={`bg-[#BB30C4] font-bold cursor-pointer rounded-lg text-white hover:bg-[#961C9FFF] transition-colors p-4 ${
                  isResetting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isResetting ? 'Resetting...' : 'Reset Password'}
              </button>
              <button 
                type="button" 
                onClick={() => { setIsResetPassword(false); router.push('/'); }}
                className="text-[#BB30C4] hover:underline cursor-pointer"
              >
                Back to Login
              </button>
            </form>
          ) : (
            isResetPassword ? (
              <form onSubmit={handleResetPassword} className="cursor-pointer flex flex-col gap-4 w-full max-w-sm p-6 rounded-lg shadow-lg bg-white hover:shadow-2xl transition-all duration-300 " style={{ animation: 'float 3s ease-in-out infinite' }}>
                <h1 className="text-4xl font-bold mb-4 text-left text-[#BB30C9]">Reset Password</h1>
                {errorMessage && (
                  <p className="bg-[#FF4C4C] text-white text-justify rounded-2xl p-4 flex items-center gap-2">
                    <AiFillExclamationCircle size={24} />
                    {errorMessage}
                  </p>
                )}
                <input
                  type="email"
                  name="emailReset"
                  placeholder="Email"
                  value={emailReset}
                  onChange={(e) => setEmailReset(e.target.value)}
                  className="border-2 border-[#656572] bg-transparent rounded-lg p-3 text-black pl-6"
                  required
                />
                <button 
                  type="submit" 
                  disabled={isSendingCode}
                  className={`bg-[#BB30C4] font-bold cursor-pointer rounded-lg text-background hover:bg-[#961C9FFF] transition-colors p-4 ${
                    isSendingCode ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSendingCode ? 'Sending...' : 'Send Code'}
                </button>
                <button type="button" onClick={() => {
                  setIsResetPassword(false);
                  resetFormFields();
                }} className="text-[#BB30C4] hover:underline cursor-pointer">
                  Back to Login
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="cursor-pointer flex flex-col gap-4 w-full max-w-sm p-6 rounded-lg shadow-lg bg-white hover:shadow-2xl transition-all duration-300" style={{ animation: 'float 3s ease-in-out infinite' }}>
                {/* Error Messages */}
                <h1 className="text-4xl font-bold mb-4 text-left text-[#BB30C9]">{isLogin ? "Login" : "Sign Up"}</h1>
                {errorMessage && (
                  <p className="bg-[#FF4C4C] text-white text-justify rounded-2xl p-4 flex items-center gap-2">
                    <AiFillExclamationCircle size={24} style={{ flex: "none" }} />
                    {errorMessage}
                  </p>
                )}
                {!isLogin && (
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username || ""}
                    onChange={handleInputChange}
                    className="border-2 border-[#656572] bg-transparent rounded-lg p-3 text-black pl-6"
                    required
                  />
                )}
                <input
                  type={isLogin ? "text" : "email"}
                  name="email"
                  placeholder={isLogin ? "Username / Email" : "Email"}
                  value={formData.email || ""}
                  onChange={handleInputChange}
                  className="border-2 border-[#656572] bg-transparent rounded-lg p-3 text-black pl-6 sm:border-[#656572]"
                  required
                />
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password.trim() || ""}
                    onChange={handleInputChange}
                    className="border-2 border-[#656572] bg-transparent rounded-lg p-3 text-black pl-6 w-full"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                  </button>
                </div>
                {isLogin && (
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsResetPassword(true);
                      resetFormFields();
                    }} 
                    className="text-[#BB30C4] font-bold hover:underline text-left cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                )}
                {!isLogin && (
                  <div className="relative">
                    <input
                      type={showRepeatPassword ? "text" : "password"}
                      name="repeatPassword"
                      placeholder="Repeat Password"
                      value={formData.repeatPassword.trim()|| ""}
                      onChange={handleInputChange}
                      className="border-2 border-[#656572] bg-transparent rounded-lg p-3 text-black pl-6 w-full"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showRepeatPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                    </button>
                  </div>
                )}
                <button 
                  type="submit"  
                  disabled={isSubmitting}
                  className={`bg-[#BB30C4] font-bold cursor-pointer rounded-lg text-white hover:bg-[#961C9FFF] transition-colors p-4 ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (isLogin ? 'Logging in...' : 'Signing up...') : (isLogin ? 'Login' : 'Sign Up')}
                </button>
                <button type="button" onClick={() => {
                  setIsLogin(!isLogin);
                  resetFormFields();
                }} className="text-[#BB30C4] hover:underline cursor-pointer">
                  {isLogin ? (
                    <>
                      Don't have an account? <strong className="italic md:italic">Sign Up</strong>
                    </>
                  ) : (
                    <>
                      Already have an account? <strong className="italic md:italic">Login</strong>
                    </>
                  )}
                </button>
              </form>
            )
          )}
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}