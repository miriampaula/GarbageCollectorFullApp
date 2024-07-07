"use client";

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import L from 'leaflet';
import 'leaflet-routing-machine';

// Fix Leaflet's default icon issue
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

const Routing = ({ routes }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || routes.length === 0) return;

    const routingControls = routes.map(route =>
      L.Routing.control({
        waypoints: route.map(point => L.latLng(point[0], point[1])),
        routeWhileDragging: true,
        router: L.Routing.osrmv1({
          serviceUrl: 'https://router.project-osrm.org/route/v1/',
        }),
        lineOptions: {
          styles: [{ color: 'blue', weight: 4 }],
        },
      }).addTo(map)
    );

    return () => {
      routingControls.forEach(control => map.removeControl(control));
    };
  }, [map, routes]);

  return null;
};

const Map = ({ routes }) => {
  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer
        style={{ height: '100%', width: '100%' }}
        center={routes.length ? routes[0][0] : [0, 0]}
        zoom={13}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <Routing routes={routes} />
        {routes.flat().map((point, index) => (
          <Marker key={index} position={point} />
        ))}
      </MapContainer>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Map), { ssr: false });
