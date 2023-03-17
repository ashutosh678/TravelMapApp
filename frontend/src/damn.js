
import * as React from 'react';
import ReactMapGL, {Marker,Popup} from "react-map-gl";
import { useEffect, useState } from "react";
import {Room , Star} from "@material-ui/icons"
import "./app.css"
import axios from "axios"

function App() {

  const [pins,setPins]= useState([]);

  useEffect(()=>{
    const getPins = async (req,res)=>{
      try {
        const allPins= await axios.get("http://localhost:8800/api/pins")
        console.log("---------------------")
        console.log(allPins.data)
        setPins(allPins.data);
      } catch (err) {
        console.log(err)
      }
    };
    getPins();
  },[]);

  return (
    <div className='App'>
      <ReactMapGL
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        initialViewState={{
          longitude: 17,
          latitude: 46,
          zoom: 4,
        }}
        style={{width: "100vw", height: "100vh"}}

        mapStyle="mapbox://styles/mapbox/streets-v9"
      >

        {pins.map((p)=>{
          <>
          <Marker
          longitude={2.294694} 
          latitude={48.858093} 
          offsetLeft={-20}
          offsetTop={-10}
          >
          <Room style={{color:"red"}} />
        </Marker>

        {/* <Popup 
        longitude={2.294694} 
        latitude={48.858093}
        anchor="left">
        <div className='card'>
        <label>Place</label>
        <h4 className='place'>Eiffel Tower</h4>
        <label>Review</label>
        <p>Beautiful Place, I love it</p>
        <label>Rating</label>
        <div className="stars">
        <Star className='star'/>
        <Star className='star'/>
        <Star className='star'/>
        <Star className='star'/>
        <Star className='star'/>
        </div>
        <label>Information</label>
        <span className='username'>Created by <b>Safak</b></span>
        <span className='date'> 1 hour ago</span>
        </div>
      </Popup> */}
      </>
    })}
      </ReactMapGL>
    </div>
  );
}

export default App;

