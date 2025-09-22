import { useEffect, useState } from "react";
import { fetchUsers } from "../utils/fetchUsers";

export interface UserType {
  id: number;
  first_name: string;
  last_name: string;
}

const useFetchUsers = () => {
  const [users, setUsers] = useState<Record<number, string>>({}); 
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data: UserType[] = await fetchUsers(); 

        const userMap: Record<number, string> = {};
        data.forEach((user) => {
          let fullName = `${user.first_name} ${user.last_name}`.trim();
          userMap[user.id] = fullName || `User ${user.id}`;
        });

        setUsers(userMap);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { users, loading, error };
};

export default useFetchUsers;


