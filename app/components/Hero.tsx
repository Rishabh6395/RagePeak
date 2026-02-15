import React from "react";

const Hero = () => {
  return (
    <div>
      {/* Background Video */}
      <div className="relative w-full h-screen overflow-hidden">
        <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        poster="https://assets.gymshark.com/wl6q2in9o7k3/7nYAwaXWqvx1u5wEKXYeuG/07d71044440f62a466996247f6af7b47/Headless_Desktop_-_25498823.jpeg"
        autoPlay
        muted
        loop
        playsInline
      >
        <source
          src="https://assets.gymshark.com/wl6q2in9o7k3/4tW92Wk1DrDUNX7UM3hImP/d0cd5c8bf7e174d7c64a01dc7f52a80f/SEASONAL_LIFTING_FEMALE_8x3_BANNER_EVERYDAY_SEAMLESS.mp4"
          type="video/mp4"
        />
      </video>

      {/* Overlay Content */}
      <div className="absolute bottom-0 left-0 z-10 p-6 text-white">
        <h1 className="text-5xl font-bold mb-4 justify-start">New In Red</h1>
        <p className="mb-6">
          Our bestselling styles, in trending shades of red.
        </p>

        <div className="flex gap-4">
          <a href="/collections" className="bg-white text-black px-6 py-3">
            Shop In New
          </a>
          <a href="/collections/Men" className="border border-white px-6 py-3">
            Shop In New Men
          </a>
        </div>
      </div>
      </div>
      
      
    </div>
  );
};

export default Hero;
