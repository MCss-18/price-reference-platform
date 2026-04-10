import { useEffect, useState } from "react";
import { Session } from "@/types/session.type";
import { sessionService } from "@/service/session.service";

export function useSessionList() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await sessionService.getAll();
      setSessions(data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = () => {
    fetchData();
  };

  return {
    sessions,
    isLoading,
    handleSave
  };
}
