import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from "react-lottie";
import animationData from "../../assets/Animation - 1724759319469.json";

const BlockedPage: React.FC = () => {
  const navigate = useNavigate();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    const preventNavigation = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', () => {
      window.history.pushState(null, '', window.location.href);
    });

    window.addEventListener('beforeunload', preventNavigation);

    const handleContextMenu = (e: Event) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) && e.key === 'r' ||
        (e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'r' ||
        e.altKey && e.key === 'ArrowLeft'
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', () => {});
      window.removeEventListener('beforeunload', preventNavigation);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-md w-full">
        <div className="bg-red-600 p-4">
          <h1 className="text-2xl font-bold text-white text-center">Account Blocked</h1>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <Lottie options={defaultOptions} height={250} width={250} />
          </div>
          <p className="text-gray-700 text-center mb-4">
            We're sorry, but your account has been blocked by an administrator.
          </p>
         
        </div>
        
      </div>
    </div>
  );
};

export default BlockedPage;