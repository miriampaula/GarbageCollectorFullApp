import React from "react";
import { FaTruck } from "react-icons/fa";

const SideBar = ({
  onGenerateRoutes,
  toggleCategoryVisibility,
  visibleCategories,
  deployedCars,
  selectedPercentage,
  setSelectedPercentage, // Add setter for selectedPercentage
}) => {
  const categories = [
    { type: "Plastic", color: "#04395E" },
    { type: "Paper", color: "#5f14ec" },
    { type: "Glass", color: "#5cc881" },
    { type: "Metal", color: "#009CDA" },
  ];

  const totalCars = 20; // Total number of cars
  const carsOnRoad = deployedCars.length; // Number of deployed cars

  const occupancyData = [
    { type: "All", percent: 75, color: "bg-blue-500/50" },
    { type: "Plastic", percent: 50, color: "bg-[#04395E]" },
    { type: "Paper", percent: 80, color: "bg-[#5f14ec]" },
    { type: "Glass", percent: 60, color: "bg-[#5cc881]" },
    { type: "Metal", percent: 56, color: "bg-[#009CDA]" },
  ];

  const handlePercentageChange = (e) => {
    setSelectedPercentage(parseInt(e.target.value, 10));
  };

  return (
    <div className="grid  xl:ml-2 mt-2 py-3 xl:px-6 h-5/6 justify-between">
      <div>
        <h2 className="text-xl font-bold mb-4">Occupancy</h2>
        <div className="grid gap-3 grid-flow-col auto-cols-fr justify-evenly">
          {occupancyData.map((container, index) => (
            <div
              key={index}
              className="grid place-content-center gap-1 text-center mx-auto"
            >
              <div className="w-2 mx-auto bg-gray-300 relative h-20">
                <div
                  className={`${container.color} w-2 absolute inset-x-0 flex flex-col bottom-0 justify-center`}
                  style={{ height: `${container.percent}%` }}
                ></div>
              </div>
              <div>{container.percent}%</div>
            </div>
          ))}
        </div>
        <div className="mt-2">
          <div className="grid grid-cols-2 gap-1 mx-3">
            {occupancyData.map((container, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-4 h-4 mr-2 ${container.color}`}></div>
                <div>{container.type}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-bold mb-4">Category Map Selection</h2>
        <div className="grid grid-cols-2 gap-2">
          {categories.map((category, index) => (
            <div key={index} className="flex items-center">
              <label className="ml-2 inline-flex relative items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={visibleCategories[category.type]}
                  onChange={() => toggleCategoryVisibility(category.type)}
                />
                <div
                  className="w-11 h-6 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"
                  style={{
                    backgroundColor: visibleCategories[category.type]
                      ? category.color
                      : `${category.color}30`, // 50% opacity for lighter color
                  }}
                ></div>
              </label>
              <div className={`ml-2`} style={{ color: category.color }}>
                {category.type}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mt-10">Cars Available</h2>
        <div className="text-xs mb-2">
          Cars on road: {carsOnRoad}/{totalCars}
        </div>
        <div className="flex flex-wrap gap-2">
          {deployedCars.map((car, index) => (
            <FaTruck key={index} className={`text-xl text-[#5f14ec]`} />
          ))}
          {[...Array(totalCars - deployedCars.length)].map((_, index) => (
            <FaTruck key={index} className={`text-xl text-gray-300`} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mt-6">Generate Routes</h2>
        <div className="">
          <label htmlFor="percentage" className="block mb-2">
            Select Percentage:
          </label>
          <select
            id="percentage"
            value={selectedPercentage}
            onChange={handlePercentageChange}
            className="w-full mb-4 p-2 border rounded"
          >
            {[...Array(10)].map((_, i) => {
              const value = (i + 1) * 10;
              return (
                <option key={value} value={value}>
                  {value}%
                </option>
              );
            })}
          </select>
        </div>
        <button
          onClick={onGenerateRoutes}
          className="w-full bg-gradient-to-br from-blue-500 to-purple-500 font-bold text-white py-2 px-4 rounded-3xl"
        >
          Generate Routes
        </button>
      </div>
    </div>
  );
};

export default SideBar;
