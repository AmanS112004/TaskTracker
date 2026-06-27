import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";
import HeroIllustration from "../components/HeroIllustration.jsx";
import { FolderKanban, ShieldAlert, Check } from "lucide-react";
import toast from "react-hot-toast";

const AuthPage = () => {
  const { login, register, setAuthSession } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDashboardTransitioning, setIsDashboardTransitioning] = useState(false);
  const [authError, setAuthError] = useState("");

  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: isLoginSubmitting },
    reset: resetLoginForm
  } = useForm();

  const {
    register: signupRegister,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors, isSubmitting: isSignupSubmitting },
    reset: resetSignupForm
  } = useForm();

  const handleToggleForm = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsLogin((prev) => !prev);
      setAuthError("");
      resetLoginForm();
      resetSignupForm();
    }, 400);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 850);
  };

  const onLogin = async (data) => {
    setAuthError("");
    const res = await login(data.email, data.password);
    if (res.success) {
      setIsDashboardTransitioning(true);
      toast.success("Welcome back!");
      setTimeout(() => {
        setAuthSession(res.data.token, res.data.user);
      }, 1000);
    } else {
      setAuthError(res.error);
    }
  };

  const onSignup = async (data) => {
    setAuthError("");
    if (data.password !== data.confirmPassword) {
      setAuthError("Passwords do not match");
      return;
    }
    const res = await register(data.name, data.email, data.password, data.workspaceName);
    if (res.success) {
      setIsDashboardTransitioning(true);
      toast.success("Workspace created!");
      setTimeout(() => {
        setAuthSession(res.data.token, res.data.user);
      }, 1000);
    } else {
      setAuthError(res.error);
    }
  };

  return (
    <div className="h-screen w-screen grid grid-cols-1 lg:grid-cols-10 overflow-hidden relative select-none">
      <div className="lg:col-span-6 h-full flex flex-col justify-between p-10 bg-transparent relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#E26343] rounded-xl text-[#F2EEE9] shadow-lg shadow-[#E26343]/20">
            <FolderKanban className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xs font-black text-[#334A6A] tracking-widest uppercase leading-none">TASKTRACKER</h1>
            <span className="text-[8px] text-[#5D594D] font-bold uppercase tracking-widest block mt-1 font-mono">Iteration Space</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 my-auto">
          <div className="max-w-md space-y-5 text-center lg:text-left">
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl lg:text-6xl font-black text-[#E26343] tracking-tighter leading-none"
            >
              Build.<br />Track. Finish.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-lg text-[#334A6A] font-medium leading-relaxed"
            >
              A handcrafted workspace designed for builders who value clarity over clutter.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 gap-x-4 gap-y-3 pt-3"
            >
              {[
                "Organize iterations",
                "Track progress",
                "Focus on execution",
                "Personal workspace"
              ].map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-bold text-[#5D594D]">
                  <div className="p-0.5 rounded-full bg-[#E26343]/10 text-[#E26343] border border-[#E26343]/20">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>{feat}</span>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="hidden lg:block w-full max-w-[280px]">
            <HeroIllustration />
          </div>
        </div>

        <div className="text-[10px] text-[#5D594D] font-bold uppercase tracking-widest text-center lg:text-left">
          "One task at a time. Every iteration counts."
        </div>
      </div>

      <div className="lg:col-span-4 h-full bg-[#EFE5C8]/40 border-l border-black/5 flex items-center justify-center p-8 relative overflow-hidden z-10">
        <AnimatePresence>
          {isTransitioning && (
            <motion.div
              initial={{ clipPath: "circle(0% at 100% 50%)" }}
              animate={{ clipPath: "circle(150% at 100% 50%)" }}
              exit={{ clipPath: "circle(0% at 0% 50%)" }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0 bg-[#E26343] z-30 flex items-center justify-center"
            >
              <h3 className="text-sm font-black text-[#F2EEE9] tracking-widest uppercase font-mono animate-pulse">
                {isLogin ? "Registering Workspace..." : "Returning to Login..."}
              </h3>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-2xl font-black text-[#334A6A] tracking-tight leading-tight">
              {isLogin ? "Welcome Back" : "Create Workspace"}
            </h3>
            <p className="text-xs text-[#5D594D] font-semibold">
              {isLogin ? "Sign in to your workspace." : "Initiate a clean developer board."}
            </p>
          </div>

          {authError && (
            <div className="p-3.5 bg-rose-500/10 text-rose-800 border border-rose-500/20 rounded-2xl flex items-center gap-2.5 text-xs font-bold leading-relaxed">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {isLogin ? (
            <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#5D594D]">Email</label>
                <input
                  type="email"
                  {...loginRegister("email", { required: "Email is required" })}
                  className="w-full glass-input rounded-xl px-4 py-3 text-sm focus:outline-none placeholder-[#334A6A]/40"
                  placeholder="e.g. name@workspace.com"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#5D594D]">Password</label>
                <input
                  type="password"
                  {...loginRegister("password", { required: "Password is required" })}
                  className="w-full glass-input rounded-xl px-4 py-3 text-sm focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-bold text-[#334A6A]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded accent-[#E26343]" />
                  <span>Remember Me</span>
                </label>
                <button type="button" className="hover:underline">Forgot Password</button>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoginSubmitting}
                className="w-full py-3.5 bg-[#E26343] hover:bg-[#D85A3D] text-[#F2EEE9] rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-[#E26343]/15 transition cursor-pointer"
              >
                {isLoginSubmitting ? "Verifying..." : "Continue"}
              </motion.button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={handleToggleForm}
                  className="text-xs font-bold text-[#5D594D] hover:text-[#E26343] transition cursor-pointer"
                >
                  Don't have an account? <span className="underline">Create Workspace</span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit(onSignup)} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#5D594D]">Workspace Name</label>
                <input
                  type="text"
                  {...signupRegister("workspaceName", { required: "Workspace Name is required" })}
                  className="w-full glass-input rounded-xl px-4 py-2.5 text-sm focus:outline-none placeholder-[#334A6A]/40"
                  placeholder="e.g. Iteration Alpha"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#5D594D]">Name</label>
                <input
                  type="text"
                  {...signupRegister("name", { required: "Name is required" })}
                  className="w-full glass-input rounded-xl px-4 py-2.5 text-sm focus:outline-none placeholder-[#334A6A]/40"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#5D594D]">Email</label>
                <input
                  type="email"
                  {...signupRegister("email", { required: "Email is required" })}
                  className="w-full glass-input rounded-xl px-4 py-2.5 text-sm focus:outline-none placeholder-[#334A6A]/40"
                  placeholder="e.g. name@workspace.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#5D594D]">Password</label>
                  <input
                    type="password"
                    {...signupRegister("password", { required: "Password is required" })}
                    className="w-full glass-input rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#5D594D]">Confirm</label>
                  <input
                    type="password"
                    {...signupRegister("confirmPassword", { required: "Confirm Password is required" })}
                    className="w-full glass-input rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSignupSubmitting}
                className="w-full py-3.5 bg-[#E26343] hover:bg-[#D85A3D] text-[#F2EEE9] rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-[#E26343]/15 transition cursor-pointer mt-2"
              >
                {isSignupSubmitting ? "Creating..." : "Create Workspace"}
              </motion.button>

              <div className="text-center pt-1.5">
                <button
                  type="button"
                  onClick={handleToggleForm}
                  className="text-xs font-bold text-[#5D594D] hover:text-[#E26343] transition cursor-pointer"
                >
                  Already have an account? <span className="underline">Sign In</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isDashboardTransitioning && (
          <motion.div
            initial={{ clipPath: "circle(0% at 50% 50%)" }}
            animate={{ clipPath: "circle(150% at 50% 50%)" }}
            transition={{ duration: 1.0, ease: "easeInOut" }}
            className="fixed inset-0 bg-[#E26343] z-50 flex flex-col items-center justify-center gap-4"
          >
            <FolderKanban className="w-12 h-12 text-[#F2EEE9] animate-bounce" />
            <h2 className="text-xl font-black text-[#F2EEE9] tracking-widest uppercase font-mono animate-pulse">
              Entering Workspace
            </h2>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthPage;
