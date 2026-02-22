import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useSocket } from '../../hooks/useSocket';
import { getInitials } from '../../utils/helpers';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isConnected } = useSocket();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  return (
    <nav className="bg-grey-darkest border-b border-grey-medium px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <span className="text-black-primary font-bold text-lg">T</span>
          </div>
          <span className="text-xl font-bold text-text-secondary">Task Manager</span>
        </Link>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Connection status indicator */}
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-text-muted">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          {/* User dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 hover:bg-hover px-3 py-2 rounded-md transition-colors"
            >
              <div className="w-8 h-8 bg-accent text-black-primary rounded-full flex items-center justify-center font-semibold">
                {getInitials(user?.username || user?.email)}
              </div>
              <span className="text-text-primary">{user?.username}</span>
              <svg
                className={`w-4 h-4 text-text-muted transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown menu */}
            {showDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-grey-darkest border border-grey-medium rounded-lg shadow-lg z-20">
                  <div className="px-4 py-3 border-b border-grey-medium">
                    <p className="text-sm text-text-primary font-medium">{user?.username}</p>
                    <p className="text-xs text-text-muted">{user?.email}</p>
                  </div>
                  <div className="py-2">
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-text-primary hover:bg-hover"
                      onClick={() => setShowDropdown(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-hover"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
