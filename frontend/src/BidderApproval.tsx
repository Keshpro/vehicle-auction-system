import { useEffect, useState } from "react";
import "./admin.css";

type Bidder = {
  userId: number;
  fullName: string;
  email: string;
  approvalStatus: string;
};

const usersApi = "http://localhost:5000/api/admin/users";

export default function BidderApproval() {
  const [bidders, setBidders] = useState<Bidder[] | null>(null);
  const [approvingId, setApprovingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadBidders() {
      try {
        const response = await fetch(`${usersApi}/pending-bidders`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error();

        const pendingBidders: Bidder[] = await response.json();
        setBidders(pendingBidders);
      } catch {
        if (!controller.signal.aborted) {
          setError("Could not load pending bidders.");
        }
      }
    }

    void loadBidders();
    return () => controller.abort();
  }, []);

  async function approveBidder(userId: number) {
    setError("");
    setApprovingId(userId);

    try {
      const response = await fetch(`${usersApi}/${userId}/approval`, {
        method: "PUT",
      });
      if (!response.ok) {
        setError(`Approval failed (${response.status}). Refresh the list and try again.`);
        return;
      }

      setBidders((current) =>
        current === null ? null : current.filter((bidder) => bidder.userId !== userId),
      );
    } catch {
      setError("Could not reach the API. Check that the backend is running.");
    } finally {
      setApprovingId(null);
    }
  }

  return (
    <section className="admin-page">
      <h1>Bidder Approval</h1>
      {error && <p role="alert">{error}</p>}

      {bidders === null ? (
        !error && <p>Loading pending bidders…</p>
      ) : bidders.length === 0 ? (
        <p>No pending bidders.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Approval Status</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {bidders.map((bidder) => (
              <tr key={bidder.userId}>
                <td>{bidder.fullName}</td>
                <td>{bidder.email}</td>
                <td>{bidder.approvalStatus}</td>
                <td>
                  <button
                    type="button"
                    disabled={approvingId !== null}
                    onClick={() => void approveBidder(bidder.userId)}
                  >
                    {approvingId === bidder.userId ? "Approving…" : "Approve"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}