import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { login, register, logout, requestPasswordReset, verifyOTP, confirmPasswordReset, updateProfile, changePassword } from '../api/auth';

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
}

export const useAuth = (setView: React.Dispatch<React.SetStateAction<any>>): UseAuthReturn => {
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
      alert("OTP expired. Please request a new one.");
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
        plan: 'free',
        isAdmin: false,
        createdAt: new Date().toISOString(),
        daysRemaining: 14,
        savedPalettes: []
      };
      setCurrentUser(user);
      localStorage.setItem('barqr_user', JSON.stringify(user));

      const searchParams = new URLSearchParams(window.location.search);
      const next = searchParams.get('next');
      if (next) {
        window.history.pushState({}, '', decodeURIComponent(next));
        window.dispatchEvent(new PopStateEvent('popstate'));
      } else {
        setView('my_codes');
      }
    } catch (err) {
      alert("Login failed. Please check your credentials.");
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
      alert("Passwords don't match!");
      return;
    }
    try {
      const data = await register(regEmail, regEmail, regPassword, regName, regLastName);
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
      localStorage.setItem('barqr_user', JSON.stringify(user));
      setView('my_codes');
    } catch (err) {
      alert("Registration failed. Please try again.");
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
        localStorage.setItem('barqr_user', JSON.stringify(updatedUser));
      }
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (accPassword !== accConfirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    try {
      await changePassword(accPassword);
      setAccPassword('');
      setAccConfirmPassword('');
      alert("Password changed successfully!");
    } catch (err) {
      alert("Failed to change password. Please try again.");
    }
  };

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await requestPasswordReset(resetEmail);
      setResetStep(2);
      setResetTimer(180);
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to request password reset.");
    }
  };

  const handleResetVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verifyOTP(resetEmail, resetOTP);
      setResetStep(3);
      setResetTimer(0);
    } catch (err: any) {
      alert(err.response?.data?.error || "Invalid or expired OTP.");
    }
  };

  const handleResetConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await confirmPasswordReset(resetEmail, newPasswordReset);
      alert("Password reset successfully! Please login with your new password.");
      setView('auth');
      setResetStep(1);
      setResetEmail('');
      setResetOTP('');
      setNewPasswordReset('');
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to reset password.");
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
  };
};
