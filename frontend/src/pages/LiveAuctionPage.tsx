
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Radio,
  Volume2,
  VolumeX,
  RotateCcw,
} from "lucide-react";

import AuctionLanes from "../components/auction/AuctionLanes";
import VehicleGallery from "../components/auction/VehicleGallery";
import VehicleSpecifications from "../components/auction/VehicleSpecifications";
import BiddingPanel from "../components/auction/BiddingPanel";
import AuctionQueue from "../components/auction/AuctionQueue";
import BidHistory from "../components/auction/BidHistory";

import {
  auctionVehicles,
  formatYen,
} from "../data/auctionData";

import type { AuctionBid } from "../types/auction.types";

const AUCTION_DURATION = 150;

export default function LiveAuctionPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [seconds, setSeconds] = useState(AUCTION_DURATION);
  const [activeLane, setActiveLane] = useState("B");
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "queue" | "bids"
  >("queue");

  const [currentBids, setCurrentBids] = useState<
    Record<number, number>
  >({});

  const [bidHistory, setBidHistory] = useState<AuctionBid[]>([]);

  const finished = activeIndex >= auctionVehicles.length;
  const activeVehicle = finished
    ? null
    : auctionVehicles[activeIndex];

  const currentBid = activeVehicle
    ? currentBids[activeVehicle.id] ??
      activeVehicle.startPrice
    : 0;

  // COUNTDOWN AND AUTOMATIC VEHICLE ROTATION
  useEffect(() => {
    if (finished) return;

    const interval = window.setInterval(() => {
      setSeconds((previous) => Math.max(0, previous - 1));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [finished]);

  useEffect(() => {
    if (finished || seconds > 0) return;

    if (activeIndex < auctionVehicles.length - 1) {
      setActiveIndex((previous) => previous + 1);
      setSeconds(AUCTION_DURATION);
    } else {
      setActiveIndex(auctionVehicles.length);
    }
  }, [seconds, activeIndex, finished]);

  // DEMO BID
  const placeBid = (amount: number) => {
    if (!activeVehicle || finished || seconds <= 0) return;

    if (amount <= currentBid) return;

    setCurrentBids((previous) => ({
      ...previous,
      [activeVehicle.id]: amount,
    }));

    setBidHistory((previous) => [
      ...previous,
      {
        id: Date.now(),
        vehicleId: activeVehicle.id,
        bidder: "Demo Bidder",
        amount,
        time: new Date().toLocaleTimeString(),
      },
    ]);
  };

  const resetAuction = () => {
    setActiveIndex(0);
    setSeconds(AUCTION_DURATION);
    setCurrentBids({});
    setBidHistory([]);
  };

  const vehicleBids = activeVehicle
    ? bidHistory.filter(
        (bid) => bid.vehicleId === activeVehicle.id
      )
    : [];

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-slate-900">
      {/* AUCTION HEADER */}
      <div className="mx-auto max-w-[1600px] px-4 pt-5">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-slate-900 px-5 py-4 text-white">
          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/auctions"
              className="flex items-center gap-2 text-sm font-semibold hover:text-red-400"
            >
              <ArrowLeft size={18} />
              Back to Auctions
            </Link>

            <span className="hidden h-6 w-px bg-white/20 sm:block" />

            <span className="flex items-center gap-2 rounded bg-red-600 px-3 py-1 text-sm font-bold">
              <Radio size={15} />
              DEMO LIVE
            </span>

            <h1 className="text-sm font-black uppercase md:text-lg">
              Japan Auto Auction — Tokyo
            </h1>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <span>Lane {activeLane}</span>

            <span className="text-slate-300">
              {Math.max(
                0,
                auctionVehicles.length - activeIndex
              )}{" "}
              Vehicles Left
            </span>
          </div>
        </div>
      </div>

      {/* MAIN DASHBOARD */}
      <div className="mx-auto grid max-w-[1600px] gap-5 px-4 py-5 lg:grid-cols-[230px_minmax(0,1fr)]">
        {/* LEFT SIDEBAR */}
        <aside>
          <AuctionLanes
            activeLane={activeLane}
            onLaneChange={setActiveLane}
          />
        </aside>

        {/* MAIN CONTENT */}
        <main className="min-w-0 space-y-5">
          {!finished && activeVehicle ? (
            <>
              <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_320px]">
                <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                  <VehicleGallery
                    key={activeVehicle.id}
                    images={activeVehicle.images}
                    name={activeVehicle.name}
                  />
                </div>

                <VehicleSpecifications
                  vehicle={activeVehicle}
                />

                <BiddingPanel
                  key={activeVehicle.id}
                  currentBid={currentBid}
                  seconds={seconds}
                  duration={AUCTION_DURATION}
                  onBid={placeBid}
                  disabled={finished}
                />
              </div>

              {/* CURRENT AUCTION SUMMARY */}
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-5 py-4">
                <div>
                  <p className="text-xs font-semibold uppercase text-red-600">
                    Currently Auctioning
                  </p>

                  <p className="mt-1 font-black">
                    {activeVehicle.year} {activeVehicle.name}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-slate-500">
                    Current Demo Bid
                  </p>

                  <p className="text-xl font-black text-red-600">
                    {formatYen(currentBid)}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white p-16 text-center shadow-sm">
              <h2 className="text-3xl font-black">
                Auction Session Completed
              </h2>

              <p className="mt-4 text-slate-500">
                All demo vehicles have completed their auction
                countdown.
              </p>

              <button
                type="button"
                onClick={resetAuction}
                className="mx-auto mt-6 flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 font-bold text-white hover:bg-red-700"
              >
                <RotateCcw size={18} />
                Restart Demo Auction
              </button>
            </div>
          )}

          {/* TABS */}
          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("queue")}
                  className={`rounded-lg px-5 py-3 text-sm font-bold ${
                    activeTab === "queue"
                      ? "bg-red-600 text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  Auction Queue
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("bids")}
                  className={`rounded-lg px-5 py-3 text-sm font-bold ${
                    activeTab === "bids"
                      ? "bg-red-600 text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  Previous Bids
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-3 text-sm font-semibold"
              >
                {soundEnabled ? (
                  <Volume2 size={17} />
                ) : (
                  <VolumeX size={17} />
                )}
                Sound {soundEnabled ? "On" : "Off"}
              </button>
            </div>
          </div>

          {/* QUEUE OR HISTORY */}
          {activeTab === "queue" ? (
            <AuctionQueue
              vehicles={auctionVehicles}
              activeIndex={activeIndex}
              seconds={seconds}
              duration={AUCTION_DURATION}
            />
          ) : (
            <BidHistory bids={vehicleBids} />
          )}

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs leading-6 text-amber-900">
            This is an educational auction simulation.
            Auction vehicles, lane counts, prices, bids and
            countdowns are sample data. No actual Japanese
            auction house or live bidding service is connected.
          </div>
        </main>
      </div>
    </div>
  );
}
