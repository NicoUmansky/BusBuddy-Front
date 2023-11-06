import React, { useState, useEffect, useRef } from 'react';
import styles from "./alertaChofer.module.css";
import { google } from "google-maps"; // Import google-maps types
import { useUser } from '../components/UserContext';
import { router } from "next/router";
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded'; 
import PersonIcon from '@mui/icons-material/Person';
import HistoryIcon from '@mui/icons-material/History';

const PantallaPrincipal = () => {
  const { userId, setUserId } = useUser();
  const [userName, setUserName] = useState("");
  var i = 0;
  var [address, setAddress] = useState("");
  var [destination, setDestination] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [favoriteTrips, setFavoriteTrips] = useState([]);
  const [ShowConfirmation, setShowConfirmation] = useState(false);
  const [showFirstForm, setShowFirstForm] = useState(true);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [FirstStop, setFirstStop] = useState("");
  const [LastStop, setLastStop] = useState("");
  const [linea, setLinea] = useState("");
  const [HoraSubida, setHoraSubida] = useState("");
  const [HoraBajada, setHoraBajada] = useState("");
  const [Distancia, setDistancia] = useState("");
  const [Duracion, setDuracion] = useState("");
  const [NextPage, setNextPage] = useState(false);
  const [idSolicitud, setIdSolicitud] = useState();
  const [paradaI, setParadaI] = useState();
  var [FavName, setFavName] = useState("");
  var [Showmenu, setMenu] = useState(false);
  var [relleno, setRelleno] = useState(false);
  var [idFav, setIdFav] = useState();
  const[ShowPopUp, setShowPopUp] = useState(false);
  const menuRefN = useRef(null);
  const menuRefB = useRef(null);
  const mapContainerRef = useRef(null);
  let map;
  let googleMapsInitialized = false; // Flag to indicate if the Google Maps API is loaded
  const key = process.env.NEXT_PUBLIC_API_KEY;

  useEffect(() => {
    // Load Google Maps API asynchronously only if not already initialized
    if (!googleMapsInitialized) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        googleMapsInitialized = true;
        console.log("Google Maps initialized");
       initializeMap();
      };
      document.body.appendChild(script);
    }
  }, []);

  const initializeMap = () => {
    map = new window.google.maps.Map(mapContainerRef.current, {
      center: { lat: -34.5702515, lng: -58.4533877 },
      zoom: 13,
      mapTypeControl: true,
      mapTypeControlOptions: {
        mapTypeIds: [] 
      },
    });
    map.setOptions({
      fullscreenControl: false
    })
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "inputUbi") {
      setAddress(value);
    } else if (id === "inputDestino") {
      setDestination(value);
    }
    else if (id === "confFav"){
      setFavName(value);
    }
  };

  const cerrarSesion = (e) => {
    e.preventDefault();
    setUserId(null);
    router.push({
      pathname: '/login',
    });
  }
    

var listaOpciones = [];
var contadorViajes = 0;
const ShowInfo = (step) => {
  const primera = String(step.transit.departure_stop.name);
  const ultima = String(step.transit.arrival_stop.name);
  const linea = String(step.transit.line.name);
  const HoraS = String (step.transit.departure_time.text);
  const HoraB = String(step.transit.arrival_time.text);
  const distancia = String(step.distance.text);
  const duracion = String(step.duration.text);
  listaOpciones.push([primera, ultima, linea, distancia, duracion, HoraS, HoraB]);
  // const nroViaje = String(parseInt(index) + 1);
    console.log(listaOpciones);
    return listaOpciones;
  };
  var SegundoIntento = false;

  const handleCallColectivo = (e, fav) => {
    // alert(relleno);
    e.preventDefault();
    setRelleno(fav)

    var newGuide = new window.google.maps.DirectionsService();
    var newRenderer = new window.google.maps.DirectionsRenderer();
    var primerViaje = true;
    newGuide.route(
      {
        origin: address,
        destination: destination,
        travelMode: window.google.maps.TravelMode.TRANSIT,
        transitOptions: {
          modes: [window.google.maps.TransitMode.BUS],
        },
        provideRouteAlternatives: false,
      },
      (response, status) => {
        if (status === "OK") {
          console.log(response)
          response.routes.forEach((route, index) => {
            console.log("Ruta: " + String(parseInt(index) + 1));
            route.legs[0].steps.forEach((step) => {
              if (step.travel_mode === "TRANSIT") {
                
                  ShowInfo(step);

              }
            });    
              setDistancia(listaOpciones[contadorViajes][3]);
              setFirstStop(listaOpciones[contadorViajes][0]);
              setLastStop(listaOpciones[contadorViajes][1]);
              setLinea(listaOpciones[contadorViajes][2]);
              setDuracion(listaOpciones[contadorViajes][4]);
              setHoraSubida(listaOpciones[contadorViajes][5]);
              setHoraBajada(listaOpciones[contadorViajes][6]);
          });
          // googleMapsInitialized = false;
          initializeMap(); // Create a new DirectionsRenderer object to render the directions
          newRenderer.setDirections(response);
          newRenderer.setMap(map);
          setDirectionsRenderer(newRenderer);
          setShowFirstForm(false);
          menuRefN.current.className = "alertaChofer_hiddenMenu__U0aM5";
          setShowConfirmation(true);

        } else {
          SegundoIntento = true;
          if(SegundoIntento == true){
            address = address + ", CABA";
            destination = destination + ", CABA";
            handleCallColectivo(e, fav);
            SegundoIntento = false;     
      
          }
          
          // window.alert("Directions request failed due to " + status);
          console.log(directionsRenderer);
        }
      }
    );
  };

  const addFav = (e) => {
    e.preventDefault();
    setShowPopUp(!ShowPopUp); // Cambiar el valor opuesto del estado actual

  }

  const deleteFav = (e) => {
    e.preventDefault();      
    setRelleno(false);
    // alert(idFav);
    setIdFav();
    const soli = fetch("https://breakable-turtleneck-shirt-foal.cyclic.app/DeleteFavorite", {
      method: "POST",
      body: JSON.stringify({
        id: idFav,
      }),
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(response => console.log(response));
      setShowPopUp(false);
  }


  const guardarFav = (e) => {
    e.preventDefault();
    const soli = fetch("https://breakable-turtleneck-shirt-foal.cyclic.app/AddFavorite", {
      method: "POST",
      body: JSON.stringify({
        id_usuario: userId,
        direccionOrigen: address,
        direccionDestino: destination,
        nombre: FavName,
      }),
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(response => console.log(response));
      setRelleno(true);
      setShowPopUp(false);
  }

  const toggleDropdown = (e) => {
    e.preventDefault();
    setShowDropdown(!showDropdown);
    if (showDropdown) {
      return;
    }
    fetch('https://breakable-turtleneck-shirt-foal.cyclic.app/GetFavorite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id_usuario: userId }),
    })
      .then((response) => response.json())
      .then((data) => {
        setFavoriteTrips(data);
      })
      .catch((error) => {
        console.error('Error al obtener los favoritos', error);
      });
  };

  const goToFavorite = (id) => {
    const fav = favoriteTrips.find((trip) => trip.id === id);
    setIdFav(id);
    setAddress(fav.direccionOrigen);
    setDestination(fav.direccionDestino);
    const fakeEvent = { preventDefault: () => {} };
    setMenu(false);    
    mapContainerRef.current.className = "alertaChofer_mapContainer__p0zwy";
    handleCallColectivo(fakeEvent, true);
    menuRefN.current.className = "alertaChofer_btnHamburguesa_U0aM5"
  };




  const goBack = (e) => {
    e.preventDefault();
    setShowConfirmation(false);
    setShowFirstForm(true);
    setMenu(false);
    setShowPopUp(false);
     menuRefN.current.className = "alertaChofer_btnHamburguesa_U0aM5"
  }

  const showMenu = (e) => {
    e.preventDefault();
    if(userId == null){
      router.push({
        pathname: '/login',
      });
    }
      else{
    fetch('https://breakable-turtleneck-shirt-foal.cyclic.app/user/' + userId, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((response) => setUserName(response.nombreapellido))
      .catch((error) => {
        console.error('Error al obtener el nombre del usuario', error);
      });
    setShowDropdown(false)
    setShowFirstForm(false);
    setShowConfirmation(false);
     menuRefN.current.className = "alertaChofer_hiddenMenu__U0aM5";
    setMenu(true);
    mapContainerRef.current.className = "hiddenMap";
      }
  }

  const hideMenu = (e) => {
    e.preventDefault();
    mapContainerRef.current.className = "alertaChofer_mapContainer__p0zwy";
    menuRefN.current.className = "alertaChofer_btnHamburguesa_U0aM5"
    setShowFirstForm(true);
    setMenu(false);

  }

  const getLocation = (e) => {
    e.preventDefault();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        fetch("https://breakable-turtleneck-shirt-foal.cyclic.app/findLocation/" + latitude + "," + longitude)
          .then(response => response.json())
          .then(response => {
            const address = String(response).split(",")[0];
            setAddress(address);
          });
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  async function elegirParadaRandom(e){
    e.preventDefault();
    if(userId == null){
      router.push({
        pathname: '/login',
      });
    }
    else{ 
    const paradas = fetch("https://breakable-turtleneck-shirt-foal.cyclic.app/GetParadas", {
      method: "GET",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
        }
        })
        .then(response => response.json())
        .then(response => {
          var parada = String(response);
          console.log(parada);
          const paradaI = parada.split(",")[0];
          setParadaI(parseInt(paradaI));
          const paradaD = parada.split(",")[1];
         const call = llamarColectivo(paradaI, paradaD);
        return call;
        });   
      }
  }
  
async function llamarColectivo(paradaI, paradaD){
 const soli = fetch("https://breakable-turtleneck-shirt-foal.cyclic.app/CreateSolicitud", {
      method: "POST",
      body: JSON.stringify({
        id_usuario: userId,
        id_linea: 2,
        paradaDestino: parseInt(paradaD),
        paradaInicio: parseInt(paradaI),
        direccionDestino: address,
        direccionOrigen: destination,
      }),
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(response => {
      var idReq = String(response);
      setIdSolicitud(parseInt(idReq));
      setNextPage(true);
      mapContainerRef.current.className += "hiddenMap"
      setShowConfirmation(false);
    }
      );
    
  }

    async function CancelRequest(e){
      e.preventDefault();
      const soli = fetch("https://breakable-turtleneck-shirt-foal.cyclic.app/DeleteSolicitud", {
        method: "POST",
        body: JSON.stringify({
          id: idSolicitud,          
        }),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
        .then(response => console.log(response));
         mapContainerRef.current.className = "alertaChofer_mapContainer__p0zwy"
         menuRefN.current.className = "alertaChofer_btnHamburguesa_U0aM5"

        setNextPage(false);
        setShowFirstForm(true);
        
        initializeMap();
      } 
  return (
    <div>
        <button ref={menuRefN}className={styles.btnHamburguesa} onClick={showMenu}>
        <img className={styles.tresRayitas} src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Hamburger_icon_white.svg/1024px-Hamburger_icon_white.svg.png" alt='Botón Menú'></img>
      </button>
    <div ref={mapContainerRef} className={styles.mapContainer} />
 {showFirstForm && (
      <form className={styles.container}>
        <div>
          <input
            type="text"
            placeholder="Añadir ubicación"
            defaultValue={address}
            id="inputUbi"
            className={styles.inputUbi}
            autoComplete="off"
            onChange={handleChange}
          />
          <button
            id="btnUbiActual"
            className={styles.btnUbiActual}
            onClick={getLocation}
          >
            <b>Ubicación Actual</b>
          </button>
        </div>
        <div>
          <input
            type="text"
            placeholder="Añadir destino"
            defaultValue={destination}
            id="inputDestino"
            className={styles.inputDest}
            autoComplete="off"
            onChange={handleChange}
          />
          <button 
            type="submit"
            className={styles.button}
            onClick={(e) => handleCallColectivo(e, false)}>      
            Siguiente
          </button>
        </div>
      </form>
      )}
      {ShowConfirmation && (
         <div className={styles.containerINFO}>
           {relleno ? (
            <button onClick={deleteFav}>
        <StarRoundedIcon className={styles.logoFavoritos} style={{ fontSize: 40 }} />
        </button>
      ) : ( 
          <button onClick={addFav}>
        <StarBorderRoundedIcon className={styles.logoFavoritos} style={{ fontSize: 40 }} />  
         </button>

      )}
          <button onClick={elegirParadaRandom} className={styles.buttonConfirmation}>Llamar colectivo</button>
          <button className={styles.Atrasbtn} onClick={goBack}>
            <img className={styles.Flecha}src="https://cdn-icons-png.flaticon.com/512/8138/8138445.png" alt='Botón Volver Atras'></img>
          </button>
          <div className={styles.textInfo}>
          <h1><b>Información viaje</b></h1>
          <h2>Línea: <b>{linea}</b></h2>
          <h2>Subirse en: <b>{FirstStop}</b></h2>
          <h2>Bajarse en: <b>{LastStop}</b></h2>
          <h2>Distancia: <b>{Distancia}</b>, Duración: <b>{Duracion}</b></h2>
          </div>
        </div>
        )}

      {ShowPopUp && (
        <div className={styles.PopUp}>
          <input id="confFav" className={styles.inputPopUp} placeholder='Ingresar nombre:' onChange={handleChange}></input>
          <button className={styles.btnPopUp} onClick={guardarFav}>Guardar</button>
        </div>
      )}
      {Showmenu && (
        <div className={styles.containerMENU}>
          <button ref={menuRefB}className={styles.btnHamburguesa} onClick={hideMenu}>
            <img className={styles.tresRayitasBlancas} src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Hamburger_icon_white.svg/1024px-Hamburger_icon_white.svg.png" alt='Botón Menú'></img>
          </button>
          <div>
            <button className={styles.btnCerrarSesion} onClick={cerrarSesion}>Cerrar Sesión</button>
            <img className={styles.logoCerrarSesion} src="https://static-00.iconduck.com/assets.00/logout-icon-1873x2048-lbrmz3mj.png" alt='Botón Cerrar Sesión'></img>
          </div>
     <div>
        <button className={styles.btnFrecuentes} onClick={toggleDropdown}>
          <HistoryIcon  style={{ fontSize: 60 }} />
           Viajes frecuentes
        </button>
        {showDropdown && (
          <div className={styles.dropdownContent}>
            <ul>      
            {favoriteTrips.length > 0 ? (
        favoriteTrips.map((trip) => (
          <li key={trip.id} id={trip.id}onClick={() => goToFavorite(trip.id)}>
            {trip.nombre}
          </li>
        ))
      ) : (
        <li>No hay viajes favoritos</li>
      )}
            </ul>
          </div>
        
        )}
        </div>
        <div className={styles.userInfo}>
          <h1>
            <PersonIcon alt="logo usuario"className={styles.logoUsuario} style={{ fontSize: 40 }} />
            <b>{userName}</b>
          </h1>
        </div>
      </div>
      )}

      {NextPage && (
        <div className={styles.containerINFOFinal}>
          <h2 className={styles.llegadaBus}>El colectivo llegará a las {HoraSubida} aproximadamente</h2>
          <h2 className={styles.llegadaFinal}>Llegará a su destino a las <b>{HoraBajada}</b> aproximadamente</h2>
          <button className={styles.cancelarBtn} onClick={CancelRequest}>CANCELAR VIAJE</button>
    </div>
      )}
    </div>
  
  );
};


export default PantallaPrincipal;
