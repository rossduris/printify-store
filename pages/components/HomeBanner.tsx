import React from "react";

const HomeBanner = () => {
  return (
    <div className=" w-full flex h-[400px] bg-white lg:h-[600px]">
      <div className=" grid grid-cols-2">
        <span>
          <h2>Welcome to Planet Cyborg</h2>
          <p>Grab your cyborg gear here!</p>
          <button>Browse Products</button>
        </span>
      </div>
    </div>
  );
};

export default HomeBanner;
