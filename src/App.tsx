import { useState } from "react";
import "./App.css";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

function App() {
  const [ipAddress, setIpAddress] = useState("");
  const [data, setData] = useState<DataType | null>(null);
  const [lat, setLat] = useState(48.20917);
  const [lng, setLng] = useState(16.37529);
  const MAPS_API_KEY = import.meta.env.VITE_MAPS_API_KEY;
  const GEO_API_KEY = import.meta.env.VITE_GEO_API_KEY;
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: `${MAPS_API_KEY}`,
  });

  const center = {
    lat: lat,
    lng: lng,
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setIpAddress(value);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!ipAddress) return;

    async function fetchData() {
      const response = await fetch(
        `https://geo.ipify.org/api/v2/country,city?apiKey=${GEO_API_KEY}&ipAddress=${ipAddress}`
      );
      const data = await response.json();
      const results = data;
      setData(results);
      setLat(results.location.lat);
      setLng(results.location.lng);
    }
    fetchData();
  };

  const containerStyle = {
    width: "100vw",
    height: "60vh",
  };

  return (
    <>
      <div className="top-background"></div>
      <div className="map">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={11}
          >
            <Marker position={center} />
          </GoogleMap>
        ) : (
          <></>
        )}
      </div>
      <div className="front-info">
        <p className="title">IP Address Tracker</p>
        <form className="form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder={"Search by IP address/domain/email"}
            onChange={handleChange}
            value={ipAddress}
          ></input>
          <button className="search-button"></button>
        </form>
        {data ? (
          <div className="infos">
            <div className="info-section">
              <div className="subtitle">ip address</div>
              <div className="info">{data?.ip}</div>
            </div>
            <div className="info-section">
              <div className="subtitle">location</div>
              <div className="info">
                {data?.location?.city},{data?.location.country}
              </div>
            </div>
            <div className="info-section">
              <div className="subtitle">timezone</div>
              <div className="info">{data?.location.timezone}</div>
            </div>
            <div className="info-section">
              <div className="subtitle">isp</div>
              <div className="info">{data?.isp}</div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}

export default App;
