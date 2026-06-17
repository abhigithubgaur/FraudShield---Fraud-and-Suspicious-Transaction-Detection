import { useEffect } from "react";
import { useNotifications } from "../context/NotificationContext";

const useAlerts = (userId) => {
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (!userId) return;

    const eventSource = new EventSource(
      `${import.meta.env.VITE_API_URL}/api/alerts/subscribe/${userId}`
    );

    eventSource.addEventListener("INIT", (event) => {
      addNotification({
        type: "INFO",
        message: event.data,
        timestamp: Date.now(),
      });
    });

    const handleAlert = (type) => (event) => {
      const data = JSON.parse(event.data);

      addNotification({
        type,
        message: data.message,
        timestamp: data.timestamp,
      });
    };

    eventSource.addEventListener(
      "SUSPICIOUS_ACTIVITY",
      handleAlert("WARNING")
    );

    eventSource.addEventListener(
      "CRITICAL_ALERT",
      handleAlert("CRITICAL")
    );

    eventSource.addEventListener(
      "ACCOUNT_BLOCKED",
      handleAlert("BLOCKED")
    );

    return () => {
      eventSource.close();
    };
  }, [userId]);
};

export default useAlerts;
