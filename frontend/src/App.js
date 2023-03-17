import * as React from 'react';
import ReactMapGL, {Marker,Popup} from "react-map-gl";
import { useEffect, useState } from "react";
import {Room , Star} from "@material-ui/icons"
import "./app.css"
import Register from "./components/Register"
import Login from "./components/Login"
import axios from "axios"

function App() {

  const myStorage = window.localStorage;
  const [currentUser,setCurrentUser]= useState(null);
  const [pins,setPins]= useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(()=>{
    const getPins = async (req,res)=>{
      try {
        const allPins= await axios.get("http://localhost:8800/api/pins")
        setPins(allPins.data);
      } catch (err) {
        console.log(err)
      }
    };
    getPins();
  },[]);

  const handleMarkerClick = (id,lat,long)=>{
    setCurrentPlaceId(id);
  }

  const handleAddClick = (e) => {
    console.log(e);
    const newLong= e.lngLat.lng;
    const newLat=e.lngLat.lat;
    console.log("----")
    console.log(newLong)
    console.log("----")
    console.log(newLat)
    // const [lng, lat] = e.lngLat;
    setNewPlace({
      long: newLong,
      lat: newLat,
    });
  };

  const handleSubmit = async (e)=>{
    e.preventDefault();
    const newPin = {
      username:currentUser,
      title,
      desc,
      rating,
      long:newPlace.long,
      lat:newPlace.lat
    }

    console.log(newPin);

    try {
      const res = await axios.post("http://localhost:8800/api/pins" , newPin);
      console.log(res)
      setPins([...pins,res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err)
    }
  }

  const handleLogout = ()=>{
    myStorage.removeItem("user");
    setCurrentUser(null)
  }

  return (
    <div className='App'>
      <ReactMapGL
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        initialViewState={{
          longitude: 78.8718,
          latitude: 21.7679,
          zoom: 4,
        }}
        style={{width: "100vw", height: "100vh"}}

        mapStyle="mapbox://styles/mapbox/streets-v9"

        onDblClick={handleAddClick}
      >
        {pins.map((p)=>(
          <React.Fragment key={p._id}>
        <Marker
         longitude={p.long} 
         latitude={p.lat} 
        //  offsetLeft={-20}
        //  offsetTop={-10}
        >
          <Room 
            style={{color: p.username===currentUser ? "tomato" :"red",cursor:"pointer"}} 
            onClick={()=>handleMarkerClick(p._id,p.lat,p.long)}
          />
        </Marker>

        {p._id === currentPlaceId && (

        <Popup 
         longitude={p.long} 
         latitude={p.lat}
         closeButton={true}
         closeOnClick={false}
         onClose={() => setCurrentPlaceId(null)}
         anchor="left">
         <div className='card'>
          <label>Place</label>
          <h4 className='place'>{p.title}</h4>
          <label>Review</label>
          <p>{p.desc}</p>
          <label>Rating</label>
          <div className="stars">
            {Array(p.rating).fill(<Star className='star'/>)}
          </div>
          <label>Information</label>
          <span className='username'>Created by <b>{p.username}</b></span>
          <span className='date'></span>
         </div>
        </Popup>
      )}
        </React.Fragment>
      ))}

        {newPlace && (
          <Popup 
            longitude={newPlace.long} 
            latitude={newPlace.lat}
            closeButton={true}
            closeOnClick={false}
            onClose={() => setCurrentPlaceId(null)}
            anchor="left">
              <div>
                <form onSubmit={handleSubmit}>
                  <label>Title</label>
                  <input type="text" placeholder='Enter a Title' onChange={(e)=>setTitle(e.target.value)}/>
                  <label>Review</label>
                  <textarea name="" id="" cols="" rows="" placeholder='Say us something about this place'onChange={(e)=>setDesc(e.target.value)}></textarea>
                  <label>Rating</label>
                  <select onChange={(e)=>setRating(e.target.value)}  name="" id="">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <button className='submitButton'>Add Pin</button>
                </form>
              </div>
          </Popup> 
        )}
        {currentUser ? 
          (<button className='button logout' onClick={handleLogout}>Logout</button>) : 
          (<div className='buttons'>
          <button className='button login' onClick={ () => setShowLogin(true)}>Login</button>
          <button className='button register' onClick={ () => setShowRegister(true)}>Register</button>
        </div>
        )}
      {showRegister && <Register setShowRegister={setShowRegister} />}
      {showLogin && <Login setShowLogin={setShowLogin}  myStorage={myStorage} setCurrentUser={setCurrentUser}/>}
      
      </ReactMapGL>
    </div>
  );
}

export default App;
