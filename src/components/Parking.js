import React, { useEffect, useRef } from 'react';
import './styles/Parking.css';

function Parking() {
  const mapRef = useRef(null);

  useEffect(() => {
    if (window.H && mapRef.current) {
      const platform = new window.H.service.Platform({
        apikey: 't-rDS3ii7BlcYcvlP-jMyviqn8yqr-n0_Fd_akI4MyA' // my API key
      });

      const maptypes = platform.createDefaultLayers();

      const initializeMap = (latitude, longitude) => {
        const map = new window.H.Map(
          mapRef.current,
          maptypes.vector.normal.map,
          {
            zoom: 10,
            center: { lat: latitude, lng: longitude }
          }
        );

        window.H.ui.UI.createDefault(map, maptypes, 'en-US');
      };

      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(position => {
          initializeMap(position.coords.latitude, position.coords.longitude);
          console.log(position);
        }, () => {
          // If unable to retrieve location, default to Kaunas
          initializeMap(54.9060608, 23.9403008);
        });
      } else {
        // Geolocation is not supported, default to Kaunas
        initializeMap(54.9060608, 23.9403008);
      }
    }
  }, []);

  return (
    <div className="parking-container">
            <div ref={mapRef} className="parking-map"></div>
        </div>
  );
}

export default Parking;
