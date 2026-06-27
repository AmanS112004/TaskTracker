import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { TaskProvider } from "./context/TaskContext.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import AuthPage from "./pages/AuthPage.jsx";

const NavigationFlow = () => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#ECE7D8] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#E26343] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            token ? (
              <TaskProvider>
                <MainLayout />
              </TaskProvider>
            ) : (
              <AuthPage />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

function App() {
  return (
    <AuthProvider>
      <NavigationFlow />
      <Toaster
        position="bottom-left"
        toastOptions={{
          style: {
            background: "#1e293b",
            color: "#f8fafc",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "12px",
            fontSize: "12px",
            fontWeight: "600",
          },
        }}
      />
    </AuthProvider>
  );
}

export default App;
