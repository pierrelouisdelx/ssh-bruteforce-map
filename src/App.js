import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet';
import './App.css';
import 'leaflet/dist/leaflet.css';

import marker from './img/marker.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: marker,
    iconUrl: marker,
    iconSize: [17.5, 20],
    iconAnchor: new L.Point(0, 0),
    popupAnchor: new L.Point(8, 0),
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
});

function App() {
    const accessToken = 'robwSG8HiMYNPewxsT3oytycdnlivt23wW3EZvNk9a9V3yU6pj9QhnTtNVIovcVw';
    const position = [51.505, -0.09]

    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('/api/getData').then(res => res.json()).then(data => setData(data));
    });

    return (
        <div className="App">
            <h1>SSH Bruteforce Map</h1>
            <MapContainer 
                center={[25, 0]} 
                zoom={2} 
                className='map'
                minZoom={2}
            >
                <TileLayer
                    url={`https://{s}.tile.jawg.io/jawg-matrix/{z}/{x}/{y}.png?access-token=${accessToken}`}
                />
                {
                    data.map((d, i) => (
                        <Marker
                            key = {i}
                            position={[d.lat, d.lng]}
                        >
                            <Popup>
                                <span>
                                    IP: {d.ip} <br /> Attempts: {d.attempts}
                                </span>
                            </Popup>
                        </Marker>
                    ))
                }
            </MapContainer>
        </div>
    );
}

export default App;
