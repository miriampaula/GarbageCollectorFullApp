"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import SideBar from "@/components/SideBar";
import dynamic from 'next/dynamic';

// Dynamically import the AzureMap component to avoid SSR issues.
const AzureMap = dynamic(() => import('../components/AzureMap'), { ssr: false });

export default function Home() {
  const [routes, setRoutes] = useState([]);
  const [visibleCategories, setVisibleCategories] = useState({
    Plastic: true,
    Paper: true,
    Glass: true,
    Metal: true,
  });
  const [deployedCars, setDeployedCars] = useState([]);
  const [selectedPercentage, setSelectedPercentage] = useState(60); // State for selected percentage

  const categories = {
    Plastic: '#04395E',
    Paper: '#5f14ec',
    Glass: '#5cc881',
    Metal: '#009CDA',
  };

  const fetchRoutes = async () => {

    try {
      const response = await fetch("http://127.0.0.1:5000/api/routes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedPercentage }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result); // Log the entire response to the console

      
    } catch (error) {
      console.error("Error fetching accuracy:", error);
      setResult({ answer: "Error", certainty: 0 }); // Default to error if there's an error
    }
  };


  const handleSimulateRoutes = () => {
    const startingPoint = [23.591423, 46.770439];

    const generateRandomStep = (currentPoint, stepSize) => {
      const angle = Math.random() * 2 * Math.PI;
      const lat = currentPoint[1] + stepSize * Math.sin(angle);
      const lon = currentPoint[0] + stepSize * Math.cos(angle);
      return [parseFloat(lon.toFixed(6)), parseFloat(lat.toFixed(6))];
    };

    const generateRealisticRoute = (start, numSteps, stepSize) => {
      const route = [start];
      let currentPoint = start;
      for (let i = 0; i < numSteps; i++) {
        const nextStep = generateRandomStep(currentPoint, stepSize);
        route.push(nextStep);
        currentPoint = nextStep;
      }
      route.push(start); // Return to start
      return route;
    };

    const generateRoutesForCategory = (color, category) => {
      const numSteps = 20; // Number of steps for the route
      const stepSize = 0.01; // Larger step size for more dispersion
      const routes = [];
      for (let i = 0; i < 3; i++) { // 5 routes per category
        const randomOffsetLat = (Math.random() - 0.5) * 0.1; // Random offset up to ±0.05 degrees
        const randomOffsetLon = (Math.random() - 0.5) * 0.1; // Random offset up to ±0.05 degrees
        const startWithOffset = [startingPoint[0] + randomOffsetLon, startingPoint[1] + randomOffsetLat];
        const route = generateRealisticRoute(startWithOffset, numSteps, stepSize);
        routes.push({ route, color, category });
      }
      return routes;
    };

    const newRoutes = Object.keys(categories).flatMap(category => generateRoutesForCategory(categories[category], category));
    setRoutes(newRoutes);
    setDeployedCars(newRoutes.map(route => ({ category: route.category })));
  };

  const toggleCategoryVisibility = (category) => {
    setVisibleCategories(prevState => ({ ...prevState, [category]: !prevState[category] }));
  };

  return (
    <div>
      <main>
        <div className="flex h-screen">
          <div className="xl:w-2/12 w-3/12">
            <SideBar 
              onGenerateRoutes={handleSimulateRoutes} 
              toggleCategoryVisibility={toggleCategoryVisibility} 
              visibleCategories={visibleCategories}
              deployedCars={deployedCars}
              selectedPercentage={selectedPercentage} // Pass selectedPercentage to SideBar
              setSelectedPercentage={setSelectedPercentage} // Pass setter to SideBar
            />
          </div>
          <div className=" w-9/12 xl:w-10/12  mx-10 pt-10 rounded-3xl">
            <AzureMap routes={routes} visibleCategories={visibleCategories} categories={categories} />
          </div>
        </div>
      </main>
    </div>
  );
}
