import React from "react";

const Home = () => {
  return (
    <div>
      <div>
        <h1 className="flex text-center justify-center text-md md:text-2xl font-bold text-green-500">
          Store Inventory{" "}
        </h1>
      </div>

      <div>
        <h2 className="flex text-center justify-center text-sm md:text-lg font-medium mt-4">
          {" "}
          Welcome to your dashboard! Here you can manage your store inventory,
          track orders, and monitor analytics. Use the sidebar to navigate
          through different sections of your dashboard.{" "}
        </h2>
      </div>

      <div className="flex flex-col  gap-3 mt-5  md:gap-6  ">
        <h1 className="flex justify-center items-center text-md md:text-2xl font-bold text-green-600">
          Products quantity Stock Percentage{" "}
        </h1>
        <section className="flex gap-8 justify-center items-center">
          <div>
            <h1 className="flex justify-center items-center text-md md:text-2xl font-bold ">
          Products with  quantity Below 50 left{" "}
        </h1>
          </div>
          <div>
            <h1 className="flex justify-center items-center text-md md:text-2xl font-bold ">
          Products With  quantity Above 50 Left{" "}
        </h1>
          </div>
        </section>

        <div>
             <h3 className="flex justify-center items-center text-md md:text-2xl font-bold text-green-600">
          Most ordered products in the last 14 days{" "}
        </h3>
        </div>

        <div>
               <h3 className="flex justify-center items-center text-md md:text-2xl font-bold text-green-600">
          Products with no orders in the last 14 days{" "}
        </h3>

        </div>
      </div>
    </div>
  );
};

export default Home;
