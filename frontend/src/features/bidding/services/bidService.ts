
const API_BASE =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api";

export interface Bid {
    bidId: number;
    lotId: number;
    bidderId: number;
    bidderName: string;
    amount: number;
    placedAt: string;
}

export interface PlaceBidRequest {
    amount: number;
    requestId: string;
}

export async function getBidHistory(lotId: number): Promise<Bid[]> {
    const response = await fetch(
        `${API_BASE}/lots/${lotId}/bids`,
        {
            method: "GET",
            credentials: "include",
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to load bid history (${response.status}).`);
    }

    return response.json();
}

export async function placeBid(
    lotId: number,
    data: PlaceBidRequest
): Promise<Bid> {
    const response = await fetch(
        `${API_BASE}/lots/${lotId}/bids`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(data),
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || `Failed to place bid (${response.status}).`
        );
    }

    return result.bid as Bid;
}
