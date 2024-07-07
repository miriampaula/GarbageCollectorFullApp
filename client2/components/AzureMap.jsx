"use client";
import { useEffect, useRef } from 'react';
import * as atlas from 'azure-maps-control';
import 'azure-maps-control/dist/atlas.min.css';

const AzureMap = ({ routes, visibleCategories, categories }) => {
  const mapRef = useRef(null);
  const dataSourcesRef = useRef({});
  const markersRef = useRef([]);
  const layersRef = useRef([]);

  useEffect(() => {
    const map = new atlas.Map(mapRef.current, {
      center: [23.5925, 46.7712], // Coordinates for Cluj-Napoca
      zoom: 12,
      style: 'grayscale_light', // Set the map style here
      authOptions: {
        authType: 'subscriptionKey',
        subscriptionKey: process.env.NEXT_PUBLIC_AZURE_MAPS_KEY,
      },
    });

    map.events.add('ready', () => {
      // Initialize data sources for each category
      Object.keys(categories).forEach(category => {
        const dataSource = new atlas.source.DataSource();
        map.sources.add(dataSource);
        dataSourcesRef.current[category] = dataSource;

        // Create a LineLayer for each category
        const routeLayer = new atlas.layer.LineLayer(dataSource, null, {
          strokeColor: categories[category], // Default opacity
          strokeWidth: 2,
        });
        map.layers.add(routeLayer);
        layersRef.current.push(routeLayer);
      });

      markersRef.current = [];

      routes.forEach(({ route, color }) => {
        const category = Object.keys(categories).find(key => categories[key] === color);

        if (visibleCategories[category]) {
          const routeLine = new atlas.data.LineString(route);
          const feature = new atlas.data.Feature(routeLine);
          dataSourcesRef.current[category].add(feature);

          const truckMarker = new atlas.HtmlMarker({
            position: route[0],
            htmlContent: `<div style="color: ${color}; font-size: 24px;">🚛</div>`,
          });
          map.markers.add(truckMarker);
          markersRef.current.push({ marker: truckMarker, route });
        }
      });

      markersRef.current.forEach(({ marker, route }) => animateTruck(marker, route));
    });

    return () => {
      map.dispose();
    };
  }, [routes, visibleCategories, categories]);

  const animateTruck = (marker, route) => {
    const speed = 0.01; // Adjust the speed of the animation
    let segmentIndex = 0;
    let t = 0;
    const totalSegments = route.length - 1;
    const updateInterval = 1000 / 60; // 60 FPS

    const interpolate = (start, end, t) => {
      if (!start || !end) return start;
      return [
        start[0] + (end[0] - start[0]) * t,
        start[1] + (end[1] - start[1]) * t,
      ];
    };

    const animate = () => {
      if (segmentIndex < totalSegments) {
        t += speed;
        if (t >= 1) {
          t = 0;
          segmentIndex++;
        }
        const position = interpolate(route[segmentIndex], route[segmentIndex + 1], t);
        marker.setOptions({ position });
        setTimeout(() => requestAnimationFrame(animate), updateInterval);
      } else {
        // Move to the final position and stop animation
        marker.setOptions({ position: route[route.length - 1] });
      }
    };

    animate();
  };

  return <div ref={mapRef} style={{ width: '100%', height: '80%' }} />;
};

export default AzureMap;
