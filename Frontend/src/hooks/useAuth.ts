import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { login, register, logout, requestPasswordReset, requestAdminPasswordReset, verifyOTP, confirmPasswordReset, updateProfile, changePassword, sendSignupOTP } from '../api/auth';

export interface UseAuthReturn {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  loginEmail: string;
  setLoginEmail: React.Dispatch<React.SetStateAction<string>>;
  loginPassword: string;
  setLoginPassword: React.Dispatch<React.SetStateAction<string>>;
  showLoginPassword: boolean;
  setShowLoginPassword: React.Dispatch<React.SetStateAction<boolean>>;
  handleAuth: () => Promise<void>;
  handleLogout: () => void;
  handleRegister: (e: React.FormEvent) => Promise<void>;
  handleUpdateProfile: (e: React.FormEvent) => Promise<void>;
  handleUpdatePassword: (e: React.FormEvent) => Promise<void>;
  regName: string;
  setRegName: React.Dispatch<React.SetStateAction<string>>;
  regLastName: string;
  setRegLastName: React.Dispatch<React.SetStateAction<string>>;
  regEmail: string;
  setRegEmail: React.Dispatch<React.SetStateAction<string>>;
  regPhone: string;
  setRegPhone: React.Dispatch<React.SetStateAction<string>>;
  regPassword: string;
  setRegPassword: React.Dispatch<React.SetStateAction<string>>;
  regConfirmPassword: string;
  setRegConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
  showRegPassword: boolean;
  setShowRegPassword: React.Dispatch<React.SetStateAction<boolean>>;
  showRegConfirmPassword: boolean;
  setShowRegConfirmPassword: React.Dispatch<React.SetStateAction<boolean>>;
  resetStep: 1 | 2 | 3;
  setResetStep: React.Dispatch<React.SetStateAction<1 | 2 | 3>>;
  resetEmail: string;
  setResetEmail: React.Dispatch<React.SetStateAction<string>>;
  resetOTP: string;
  setResetOTP: React.Dispatch<React.SetStateAction<string>>;
  resetTimer: number;
  setResetTimer: React.Dispatch<React.SetStateAction<number>>;
  newPasswordReset: string;
  setNewPasswordReset: React.Dispatch<React.SetStateAction<string>>;
  handleResetRequest: (e: React.FormEvent) => Promise<void>;
  handleAdminResetRequest: (e: React.FormEvent) => Promise<void>;
  handleResetVerify: (e: React.FormEvent) => Promise<void>;
  handleResetConfirm: (e: React.FormEvent) => Promise<void>;
  accFirstName: string;
  setAccFirstName: React.Dispatch<React.SetStateAction<string>>;
  accLastName: string;
  setAccLastName: React.Dispatch<React.SetStateAction<string>>;
  accEmail: string;
  setAccEmail: React.Dispatch<React.SetStateAction<string>>;
  accPhone: string;
  setAccPhone: React.Dispatch<React.SetStateAction<string>>;
  accPassword: string;
  setAccPassword: React.Dispatch<React.SetStateAction<string>>;
  accConfirmPassword: string;
  setAccConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
  isProcessing: boolean;
  signupStep: 1 | 2;
  setSignupStep: React.Dispatch<React.SetStateAction<1 | 2>>;
  regOtp: string;
  setRegOtp: React.Dispatch<React.SetStateAction<string>>;
}

export const useAuth = (
  setView: React.Dispatch<React.SetStateAction<any>>,
  showAlert?: (title: string, message: string, type?: 'danger' | 'info') => void
): UseAuthReturn => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [resetStep, setResetStep] = useState<1 | 2 | 3>(1);
  const [resetEmail, setResetEmail] = useState('');
  const [resetOTP, setResetOTP] = useState('');
  const [resetTimer, setResetTimer] = useState(0);
  const [newPasswordReset, setNewPasswordReset] = useState('');

  const [regName, setRegName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  const [accFirstName, setAccFirstName] = useState('');
  const [accLastName, setAccLastName] = useState('');
  const [accEmail, setAccEmail] = useState('');
  const [accPhone, setAccPhone] = useState('');
  const [accPassword, setAccPassword] = useState('');
  const [accConfirmPassword, setAccConfirmPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [signupStep, setSignupStep] = useState<1 | 2>(1);
  const [regOtp, setRegOtp] = useState('');

  const triggerAlert = (title: string, message: string, type: 'danger' | 'info' = 'info') => {
    if (showAlert) {
      showAlert(title, message, type);
    } else {
      alert(`${title}: ${message}`);
    }
  };

  useEffect(() => {
    if (currentUser) {
      setAccFirstName(currentUser.firstName || currentUser.name?.split(' ')[0] || '');
      setAccLastName(currentUser.lastName || currentUser.name?.split(' ').slice(1).join(' ') || '');
      setAccEmail(currentUser.email || '');
    }
  }, [currentUser]);

  useEffect(() => {
    let interval: any;
    if (resetTimer > 0) {
      interval = setInterval(() => {
        setResetTimer((prev) => prev - 1);
      }, 1000);
    } else if (resetTimer === 0 && resetStep === 2) {
      triggerAlert("OTP Expired", "Please request a new one.", "danger");
      setResetStep(1);
    }
    return () => clearInterval(interval);
  }, [resetTimer, resetStep]);

  const handleAuth = async () => {
    try {
      const data = await login(loginEmail, loginPassword);
      const user: User = {
        id: data.user_id.toString(),
        email: data.email,
        name: `${data.first_name} ${data.last_name}`.trim() || data.email.split('@')[0],
        firstName: data.first_name,
        lastName: data.last_name,
        plan: (data.subscription?.plan || 'free') as any,
        isAdmin: false,
        isStaff: data.is_staff,
        createdAt: new Date().toISOString(),
        daysRemaining: data.subscription?.expiry_date
          ? Math.ceil((new Date(data.subscription.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
          : 0,
        savedPalettes: [],
        subscription: data.subscription
      };
      setCurrentUser(user);
      localStorage.setItem('makemyqr_user', JSON.stringify(user));

      const searchParams = new URLSearchParams(window.location.search);
      const next = searchParams.get('next');
      if (next) {
        window.history.pushState({}, '', decodeURIComponent(next));
        window.dispatchEvent(new PopStateEvent('popstate'));
      } else {
        setView('my_codes');
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.response?.data?.non_field_errors?.[0] || "Login failed. Please check your credentials.";
      triggerAlert("Login Failed", errorMsg, "danger");
    }
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    setView('landing');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== regConfirmPassword) {
      triggerAlert("Validation Error", "Passwords don't match!", "danger");
      return;
    }
    try {
      setIsProcessing(true);
      if (signupStep === 1) {
        await sendSignupOTP(regEmail);
        triggerAlert("Success", "Verification code sent to your email!", "info");
        setSignupStep(2);
      } else {
        const username = regEmail.split('@')[0] + Math.floor(Math.random() * 1000);
        const data = await register(username, regEmail, regPassword, regOtp, regName, regLastName);
        const user: User = {
          id: data.user_id.toString(),
          email: data.email,
          name: `${regName} ${regLastName}`.trim() || data.email.split('@')[0],
          firstName: regName,
          lastName: regLastName,
          plan: 'free',
          isAdmin: false,
          createdAt: new Date().toISOString(),
          daysRemaining: 14,
          savedPalettes: []
        };
        setCurrentUser(user);
        localStorage.setItem('makemyqr_user', JSON.stringify(user));
        window.location.reload();
      }
    } catch (err: any) {
      const data = err.response?.data;
      let errorMsg = "Registration failed. Please try again.";

      if (typeof data === 'string') {
        errorMsg = data;
      } else if (data) {
        if (data.error) errorMsg = data.error;
        else if (data.message) errorMsg = data.message;
        else if (data.non_field_errors?.[0]) errorMsg = data.non_field_errors[0];
        else {
          const fields = Object.keys(data);
          if (fields.length > 0) {
            const firstField = fields[0];
            const fieldError = Array.isArray(data[firstField]) ? data[firstField][0] : data[firstField];
            errorMsg = `${firstField}: ${fieldError}`;
          }
        }
      }
      triggerAlert("Registration Failed", errorMsg, "danger");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        first_name: accFirstName,
        last_name: accLastName,
        email: accEmail
      });
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          firstName: accFirstName,
          lastName: accLastName,
          email: accEmail,
          name: `${accFirstName} ${accLastName}`.trim()
        };
        setCurrentUser(updatedUser);
        localStorage.setItem('makemyqr_user', JSON.stringify(updatedUser));
      }
      triggerAlert("Success", "Profile updated successfully!", "info");
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Failed to update profile. Please try again.";
      triggerAlert("Error", errorMsg, "danger");
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (accPassword !== accConfirmPassword) {
      triggerAlert("Validation Error", "Passwords don't match!", "danger");
      return;
    }
    try {
      await changePassword(accPassword);
      setAccPassword('');
      setAccConfirmPassword('');
      triggerAlert("Success", "Password changed successfully!", "info");
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Failed to change password. Please try again.";
      triggerAlert("Error", errorMsg, "danger");
    }
  };

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      await requestPasswordReset(resetEmail);
      setResetStep(2);
      setResetTimer(180);
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Failed to request password reset.";
      triggerAlert("Reset Failed", errorMsg, "danger");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAdminResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      await requestAdminPasswordReset(resetEmail);
      setResetStep(2);
      setResetTimer(180);
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Failed to request password reset.";
      triggerAlert("Reset Failed", errorMsg, "danger");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verifyOTP(resetEmail, resetOTP);
      setResetStep(3);
      setResetTimer(0);
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Invalid or expired OTP.";
      triggerAlert("Verification Failed", errorMsg, "danger");
    }
  };

  const handleResetConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await confirmPasswordReset(resetEmail, newPasswordReset);
      triggerAlert("Success", "Password reset successfully! Please login with your new password.", "info");
      setView('login');
      setResetStep(1);
      setResetEmail('');
      setResetOTP('');
      setNewPasswordReset('');
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Failed to reset password.";
      triggerAlert("Reset Failed", errorMsg, "danger");
    }
  };

  return {
    currentUser,
    setCurrentUser,
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    showLoginPassword,
    setShowLoginPassword,
    handleAuth,
    handleLogout,
    handleRegister,
    handleUpdateProfile,
    handleUpdatePassword,
    regName,
    setRegName,
    regLastName,
    setRegLastName,
    regEmail,
    setRegEmail,
    regPhone,
    setRegPhone,
    regPassword,
    setRegPassword,
    regConfirmPassword,
    setRegConfirmPassword,
    showRegPassword,
    setShowRegPassword,
    showRegConfirmPassword,
    setShowRegConfirmPassword,
    resetStep,
    setResetStep,
    resetEmail,
    setResetEmail,
    resetOTP,
    setResetOTP,
    resetTimer,
    setResetTimer,
    newPasswordReset,
    setNewPasswordReset,
    handleResetRequest,
    handleAdminResetRequest,
    handleResetVerify,
    handleResetConfirm,
    accFirstName,
    setAccFirstName,
    accLastName,
    setAccLastName,
    accEmail,
    setAccEmail,
    accPhone,
    setAccPhone,
    accPassword,
    setAccPassword,
    accConfirmPassword,
    setAccConfirmPassword,
    isProcessing,
    signupStep,
    setSignupStep,
    regOtp,
    setRegOtp,
  };
};
