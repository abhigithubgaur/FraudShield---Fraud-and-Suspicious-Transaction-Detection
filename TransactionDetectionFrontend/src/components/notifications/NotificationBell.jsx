import { useState } from "react";

import { FaBell } from "react-icons/fa";

import { useNotifications }
from "../../context/NotificationContext";

const NotificationBell = () => {

  const [open, setOpen] =
    useState(false);

  const { notifications } =
    useNotifications();

  return (
    <div className="relative">

      <button
        onClick={() =>
          setOpen(!open)
        }
      >
        <FaBell size={22} />

        {notifications.length > 0 && (
          <span
            className="
            absolute
            -top-2
            -right-2
            bg-red-500
            text-white
            text-xs
            rounded-full
            px-2
            py-1"
          >
            {notifications.length}
          </span>
        )}
      </button>

      {open && (

        <div
          className="
          absolute
          right-0
          mt-2
          w-96
          bg-white
          shadow-lg
          rounded-lg
          z-50"
        >

          {notifications.length === 0 ? (
            <div className="p-4">
              No notifications
            </div>
          ) : (
            notifications.map(
              (n, index) => (
                <div
                  key={index}
                  className="
                  border-b
                  p-3"
                >
                  <div className="font-bold">
                    {n.type}
                  </div>

                  <div>
                    {n.message}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(n.timestamp).toLocaleString()}
                  </div>
                </div>
              )
            )
          )}

        </div>

      )}

    </div>
  );
};

export default NotificationBell;