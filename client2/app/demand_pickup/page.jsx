"use client";

import React, { useState, useEffect } from "react";

const DemandPickup = () => {
  const [requestSent, setRequestSent] = useState(false);
  const [pickupTime, setPickupTime] = useState(24); // Default to 24 hours
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    if (requestSent) {
      const targetTime = new Date().getTime() + pickupTime * 60 * 60 * 1000;
      setCountdown(targetTime);

      const interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetTime - now;

        if (distance < 0) {
          clearInterval(interval);
          setCountdown(null);
        } else {
          setCountdown(distance);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [requestSent, pickupTime]);

  const handlePickupRequest = () => {
    setRequestSent(true);
  };

  const formatTime = (milliseconds) => {
    const hours = Math.floor(
      (milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (milliseconds % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="flex justify-center h-screen bg-gray-100 overflow-hidden">
      <div className="bg-white shadow-lg mt-40 rounded-3xl p-10 h-[400px] w-96 overflow-hidden">
        {!requestSent ? (
          <div className="">
            <h1 className="text-2xl font-bold text-center mt-10 mb-6">Demand Pickup</h1>
            <p className="text-center font-thin text-lg my-10 text-gray-700">
              Click the button below to request a pickup. A truck will be dispatched to your location within the next 24 hours.
            </p>
            <div className="flex justify-center">
              <button
                className="relative px-8 py-5 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-full overflow-hidden"
                onClick={handlePickupRequest}
              >
                <span className="relative z-10">Send Truck</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-75 transform scale-0 transition-transform duration-300 ease-out animate-ripple"></div>
              </button>
            </div>
          </div>
        ) : (
          <div className="truck-container overflow-hidden">
            <div className="truck-wrapper">
              <div className="truck">
                <div className="body">
                  <div></div>
                </div>
                <div className="decos">
                  <div className="line-bot"></div>
                  <div className="door">
                    <div className="handle"></div>
                    <div className="bottom"></div>
                  </div>
                  <div className="window"></div>
                  <div className="light"></div>
                  <div className="light-front"></div>
                  <div className="antenna"></div>
                </div>
                <div>
                  <div className="wheel"></div>
                  <div className="wheel"></div>
                </div>
                <div className="wind">
                  <div className="p p1"></div>
                  <div className="p p2"></div>
                  <div className="p p3"></div>
                  <div className="p p4"></div>
                  <div className="p p5"></div>
                </div>
              </div>
            </div>
            <div className="text-center mt-24">
              <div className="text-2xl font-bold mb-6 animate-fade-in">
                Request Sent
              </div>
              <div className="text-lg font-semibold mb-6 animate-fade-in">
                Pickup in: {pickupTime} hours
              </div>
              {countdown !== null && (
                <div className="text-lg font-semibold animate-fade-in">
                  Time left: {formatTime(countdown)}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemandPickup;
