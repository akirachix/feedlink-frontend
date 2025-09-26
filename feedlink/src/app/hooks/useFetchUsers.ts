import { useEffect, useState } from "react";
import { fetchUsers } from "../utils/fetchUsers";
import { UserType } from "../utils/type";

const useFetchUsers = () => {
  const [users, setUsers] = useState<Record<number, string>>({}); 
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const user: UserType[] = await fetchUsers(); 

        const userMap: Record<number, string> = {};
        user.forEach((user) => {
          const fullName = `${user.first_name} ${user.last_name}`;
          userMap[user.id] = fullName;
        });

        setUsers(userMap);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { users, loading, error };
};

export default useFetchUsers;


