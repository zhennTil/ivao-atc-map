import './App.css'
import { MapContainer, TileLayer } from 'react-leaflet'
import { useContext } from 'react';
import MapController from './components/MapController';
import BookingLayers from './components/BookingLayers';
import DateSlider from './components/DateSlider';
import { AtcContext } from './modules/contexts/AtcProvider';

function App() {
  const { setTimeFilter } = useContext(AtcContext);

  return (
    <>
      <div className="userOverlay">
        {/* <Typography sx={{textAlign: 'right'}}>Welcome, {user?.firstName}</Typography> */}
        <div className="sliderOverlay"><DateSlider onChange={setTimeFilter}/></div>
      </div>
      <MapContainer className="map" scrollWheelZoom={true}>
        <TileLayer
          minZoom={0}
          maxZoom={20}
          attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
        />
        <MapController />
        <BookingLayers />
      </MapContainer>
    </>
  )
}

export default App
