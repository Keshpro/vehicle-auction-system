
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    getBidHistory,
    placeBid,
} from "../services/bidService";
import type { Bid } from "../services/bidService";

interface AuctionLot {
    lotId: number;
    lotNumber: number;
    vehicleId: number;
    make: string;
    model: string;
    manufactureYear: number;
    startingPrice: number;
    minimumIncrement: number;
    biddingStartsAt: string;
    biddingEndsAt: string;
    status: string;
}

interface AuctionDetails {
    auction: {
        auctionId: number;
        title: string;
        status: string;
    };
    lots: AuctionLot[];
}

const API_BASE =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api";

function formatLKR(amount: number) {
    return `Rs. ${amount.toLocaleString("en-LK", {
        maximumFractionDigits: 2,
    })}`;
}

function LotBiddingSection({ lot, auctionStatus }: {
    lot: AuctionLot;
    auctionStatus: string;
}) {
    const [bids, setBids] = useState<Bid[]>([]);
    const [bidAmount, setBidAmount] = useState(0);
    const [loadingBids, setLoadingBids] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const highestBid = bids.length > 0
        ? Math.max(...bids.map((bid) => bid.amount))
        : lot.startingPrice;

    const minimumBid = bids.length > 0
        ? highestBid + lot.minimumIncrement
        : lot.startingPrice;

    const biddingStarted =
        new Date() >= new Date(lot.biddingStartsAt);

    const biddingNotEnded =
        new Date() < new Date(lot.biddingEndsAt);

    const canBid =
        auctionStatus.toLowerCase() === "live" &&
        lot.status.toLowerCase() === "open" &&
        biddingStarted &&
        biddingNotEnded;

    useEffect(() => {
        getBidHistory(lot.lotId)
            .then((result) => {
                const sorted = [...result].sort(
                    (a, b) =>
                        new Date(b.placedAt).getTime() -
                        new Date(a.placedAt).getTime()
                );

                setBids(sorted);
            })
            .catch((err: Error) => {
                setError(err.message);
            })
            .finally(() => setLoadingBids(false));
    }, [lot.lotId]);

    useEffect(() => {
        setBidAmount(minimumBid);
    }, [minimumBid]);

    const handlePlaceBid = async () => {
        setError("");
        setSuccess("");

        if (!canBid) {
            setError("Bidding is currently unavailable for this lot.");
            return;
        }

        if (!Number.isFinite(bidAmount) || bidAmount < minimumBid) {
            setError(`Your minimum valid bid is ${formatLKR(minimumBid)}.`);
            return;
        }

        setSubmitting(true);

        try {
            const newBid = await placeBid(lot.lotId, {
                amount: bidAmount,
                requestId: crypto.randomUUID(),
            });

            setBids((previous) =>
                [newBid, ...previous].sort(
                    (a, b) =>
                        new Date(b.placedAt).getTime() -
                        new Date(a.placedAt).getTime()
                )
            );

            setSuccess("Your bid was successfully placed!");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to place your bid."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mt-6 space-y-5">
            {/* CURRENT HIGHEST BID */}
            <section className="rounded-xl border border-red-200 bg-red-50 p-5">
                <p className="text-sm font-semibold text-slate-600">
                    Current Highest Bid
                </p>

                <p className="mt-2 text-3xl font-black text-red-600">
                    {formatLKR(highestBid)}
                </p>

                <p className="mt-2 text-sm text-slate-600">
                    Minimum next bid: {formatLKR(minimumBid)}
                </p>
            </section>

            {/* BID SUBMISSION */}
            <section className="rounded-xl border border-slate-200 bg-white p-5">
                <h3 className="text-lg font-bold">Place Your Bid</h3>

                <label
                    htmlFor={`bid-${lot.lotId}`}
                    className="mt-4 block text-sm font-semibold text-slate-700"
                >
                    Enter bid amount (LKR)
                </label>

                <input
                    id={`bid-${lot.lotId}`}
                    type="number"
                    min={minimumBid}
                    step={lot.minimumIncrement}
                    value={bidAmount}
                    onChange={(event) =>
                        setBidAmount(Number(event.target.value))
                    }
                    disabled={!canBid || submitting}
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-red-500 disabled:bg-slate-100"
                />

                <p className="mt-2 text-xs text-slate-500">
                    Minimum increment: {formatLKR(lot.minimumIncrement)}
                </p>

                <button
                    type="button"
                    onClick={handlePlaceBid}
                    disabled={!canBid || submitting || loadingBids}
                    className="mt-4 w-full rounded-lg bg-red-600 py-3 font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                    {submitting
                        ? "Submitting Bid..."
                        : !canBid
                            ? "Bidding Unavailable"
                            : "Place Bid"}
                </button>

                {error && (
                    <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                        {error}
                    </p>
                )}

                {success && (
                    <p className="mt-3 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                        {success}
                    </p>
                )}

                {!biddingStarted && (
                    <p className="mt-3 text-sm text-amber-700">
                        Bidding has not started yet.
                    </p>
                )}

                {!biddingNotEnded && (
                    <p className="mt-3 text-sm text-amber-700">
                        The bidding period has ended.
                    </p>
                )}
            </section>

            {/* BID HISTORY */}
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="border-b border-slate-200 p-5">
                    <h3 className="text-lg font-bold">Bid History</h3>
                </div>

                {loadingBids ? (
                    <p className="p-5 text-sm text-slate-500">
                        Loading bid history...
                    </p>
                ) : bids.length === 0 ? (
                    <p className="p-5 text-sm text-slate-500">
                        No bids have been placed for this lot yet.
                    </p>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {bids.map((bid) => (
                            <div
                                key={bid.bidId}
                                className="flex flex-wrap items-center justify-between gap-3 p-4"
                            >
                                <div>
                                    <p className="font-semibold text-slate-800">
                                        {bid.bidderName}
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        {new Date(bid.placedAt).toLocaleString()}
                                    </p>
                                </div>

                                <p className="font-black text-red-600">
                                    {formatLKR(bid.amount)}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default function BidAuctionPage() {
    const { id } = useParams<{ id: string }>();

    const [details, setDetails] = useState<AuctionDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id || !/^\d+$/.test(id)) {
            setError("Invalid auction ID.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError("");

        fetch(`${API_BASE}/auctions/${id}`)
            .then(async (response) => {
                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.message || "Unable to load auction."
                    );
                }

                return result as AuctionDetails;
            })
            .then(setDetails)
            .catch((err: Error) => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return <p className="p-8">Loading auction...</p>;
    }

    if (error) {
        return <p className="p-8 text-red-600">{error}</p>;
    }

    if (!details) return null;

    return (
        <main className="mx-auto max-w-5xl space-y-5 p-6">
            <h1 className="text-2xl font-black">
                {details.auction.title}
            </h1>

            <p className="text-sm text-slate-500">
                Auction status: {details.auction.status}
            </p>

            {details.lots.map((lot) => (
                <section
                    key={lot.lotId}
                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                    <h2 className="text-xl font-bold">
                        {lot.make} {lot.model} ({lot.manufactureYear})
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Lot #{lot.lotNumber} · Lot ID: {lot.lotId}
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-slate-500">
                                Starting Price
                            </p>
                            <p className="font-bold">
                                {formatLKR(lot.startingPrice)}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-slate-500">
                                Minimum Increment
                            </p>
                            <p className="font-bold">
                                {formatLKR(lot.minimumIncrement)}
                            </p>
                        </div>
                    </div>

                    <p className="mt-4 text-sm">
                        Lot status: <strong>{lot.status}</strong>
                    </p>

                    <LotBiddingSection
                        lot={lot}
                        auctionStatus={details.auction.status}
                    />
                </section>
            ))}
        </main>
    );
}
