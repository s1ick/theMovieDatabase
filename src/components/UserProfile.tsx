import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useState } from 'react';

const UserProfile = () => {
  const [user] = useAuthState(auth);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut(auth);
      window.location.href = '/'; 
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex items-center space-x-4">
      <img 
        src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}&background=random`} 
        alt="User" 
          loading="lazy"
  decoding="async"
        className="h-8 w-8 rounded-full"
      />
      <span className="text-sm font-medium truncate max-w-xs">
        {user.displayName || user.email}
      </span>
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="px-3 py-1 text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
      >
        {isLoggingOut ? 'Logging out...' : 'Logout'}
      </button>
    </div>
  );
};
export default UserProfile;