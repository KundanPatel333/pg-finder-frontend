import { useEffect, useRef, useState } from "react";
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from "../api/notifications";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const loadNotifications = async () => {
    try {
      const res = await fetchNotifications();
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unreadCount);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 15000); // poll every 15s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpen = () => setOpen((prev) => !prev);

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.read) {
      try {
        await markNotificationRead(notif._id);
        setNotifications((prev) =>
          prev.map((n) => (n._id === notif._id ? { ...n, read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={handleOpen} className="relative text-gray-600 hover:text-gray-900">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-800">Notifications</p>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-gray-500 hover:text-gray-800"
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 && (
              <p className="text-xs text-gray-400 px-4 py-4 text-center">No notifications yet</p>
            )}
            {notifications.map((notif) => (
              <div
                key={notif._id}
                onClick={() => handleNotificationClick(notif)}
                className={`px-4 py-3 text-xs border-b border-gray-50 cursor-pointer hover:bg-gray-50 ${
                  notif.read ? "text-gray-500" : "text-gray-800 bg-blue-50/40"
                }`}
              >
                <p>{notif.message}</p>
                <p className="text-[10px] text-gray-400 mt-1">
                  {new Date(notif.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;