import axios from "axios";
import { users } from "../layouts/MainLayout";


export const useAuditLog = () => {
  const hostServer = import.meta.env.VITE_SERVER_HOST;

  const generateDescription = (

    customMessage?: string
  ): string => {
    let description = ''

    if (customMessage) {
      description += customMessage
    }

    return description;
  };

  const logAction = async (
    user: users,
    customMessage?: string
  ) => {
    if (!user) {
      console.error("No user ID available for audit log");
      return;
    }

    const description = generateDescription(
      customMessage
    );

    try {
      await axios.post(`${hostServer}/createLog`, {
        user_id: user?.user_id,
        description : `${description}`
      });
    } catch (err) {
      console.error("Failed to create audit log:", err);
    }
  };

  return { logAction };
};