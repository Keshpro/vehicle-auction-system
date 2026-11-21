import { useEffect, useState } from "react";
import "./admin.css";

type User = {
  userId: number;
  fullName: string;
  email: string;
  roleName: string | null;
  accountStatus: string;
};

export default function UserManagement() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadUsers() {
      try {
        const response = await fetch("http://localhost:5000/api/admin/users", {
          credentials: "include",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`The API returned ${response.status}.`);
        }

        const userList: User[] = await response.json();
        setUsers(userList);
      } catch (error) {
        if (controller.signal.aborted) return;

        setError(
          error instanceof Error ? error.message : "Could not load users.",
        );
      }
    }

    void loadUsers();
    return () => controller.abort();
  }, []);

  return (
    <section className="admin-page">
      <h1>User Management</h1>

      {error ? (
        <p role="alert">Could not load the user list. {error}</p>
      ) : users === null ? (
        <p>Loading users…</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Role</th>
              <th scope="col">Account Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={`${user.userId}:${user.roleName ?? ""}`}>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>{user.roleName ?? "Unassigned"}</td>
                <td>{user.accountStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}