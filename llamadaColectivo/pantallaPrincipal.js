import React, { useState, useEffect, useRef } from 'react';
import styles from "./alertaChofer.module.css";
import { google } from "google-maps"; // Import google-maps types

const PantallaPrincipal = () => {
  const [address, setAddress] = useState("");
  const [destination, setDestination] = useState("");
  const [ShowConfirmation, setShowConfirmation] = useState(false);
  const [showFirstForm, setShowFirstForm] = useState(true);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [FirstStop, setFirstStop] = useState("");
  const [LastStop, setLastStop] = useState("");
  const [linea, setLinea] = useState("");
  const [Distancia, setDistancia] = useState("");
  const [Duracion, setDuracion] = useState("");
  const [nroViaje, setNroViaje] = useState("");


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
    });
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "inputUbi") {
      setAddress(value);
    } else if (id === "inputDestino") {
      setDestination(value);
    }
  };

var listaOpciones = [];
const ShowInfo = (step) => {
  const primera = String(step.transit.departure_stop.name);
  const ultima = String(step.transit.arrival_stop.name);
  const linea = String(step.transit.line.name);
  const distancia = String(step.distance.text);
  const duracion = String(step.duration.text);
  listaOpciones.push([primera, ultima, linea, distancia, duracion])
  // const nroViaje = String(parseInt(index) + 1);
    setDistancia(distancia);
    setFirstStop(primera);
    setLastStop(ultima);
    setLinea(linea);
    setDuracion(duracion);
    // alert(listaOpciones)
    return listaOpciones;
  };

  const handleCallColectivo = (e) => {
    e.preventDefault();
    const newGuide = new window.google.maps.DirectionsService();
    const newRenderer = new window.google.maps.DirectionsRenderer();
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
                console.log(
                  "Linea: " +
                    step.transit.line.name +
                    ", Parada de Inicio: " +
                    step.transit.departure_stop.name +
                    ", Parada de Destino: " +
                    step.transit.arrival_stop.name +
                    ", Cantidad de paradas:" +
                    step.transit.num_stops +
                    ", Hora de salida: " +
                    step.transit.departure_time.text +
                    ", Hora de llegada: " +
                    step.transit.arrival_time.text +
                    ", Duracion: " +
                    step.duration.text +
                    ", Distancia: " +
                    step.distance.text
                );
                  ShowInfo(step);

              }
            console.log(listaOpciones)
            });
          });
          // googleMapsInitialized = false;
          initializeMap(); // Create a new DirectionsRenderer object to render the directions
          newRenderer.setDirections(response);
          newRenderer.setMap(map);
          setDirectionsRenderer(newRenderer); // Update the state with the new DirectionsRenderer
          setShowConfirmation(true);
          setShowFirstForm(false);
        } else {
          window.alert("Directions request failed due to " + status);
          console.log(directionsRenderer);
        }
      }
    );
  };

  const goBack = (e) => {
    e.preventDefault();
    setShowConfirmation(false);
    setShowFirstForm(true);
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
    const paradas = fetch("https://breakable-turtleneck-shirt-foal.cyclic.app/GetParadas", {
      method: "GET",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
        }
        })
        .then(response => response.json())
        .then(response => {
          const parada = String(response);
          console.log(parada);
          const paradaI = parada.split(",")[0];
          const paradaD = parada.split(",")[1];
          llamarColectivo(paradaI, paradaD);
        });
  }

  async function CheckDistance(lat, long) {
    try {
      const response = await fetch("https://breakable-turtleneck-shirt-foal.cyclic.app/paradas/2", {
        method: "GET",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      });
      
      const data = await response.json();
      const AllCoords = data.map(parada => [parseFloat(parada.latitud), parseFloat(parada.longitud)]);
  
      const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radio de la Tierra en kilómetros
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance;
        };
  
      const targetLat = parseFloat(lat);
      const targetLong = parseFloat(long);
  
      let closestCoord = null;
      let closestDistance = Infinity;
  
      for (const [coordLat, coordLong] of AllCoords) {
        const distance = calculateDistance(targetLat, targetLong, coordLat, coordLong);
  
        if (distance < closestDistance) {
          closestDistance = distance;
          closestCoord = [coordLat, coordLong];
        }
      }
  
      console.log("La coordenada más cercana es:", closestCoord);
      return closestCoord;
    } catch (error) {
      console.error("Error al obtener coordenadas:", error);
      return null;
    }
  }
          
async function llamarColectivo(paradaI, paradaD){
    const soli = fetch("https://breakable-turtleneck-shirt-foal.cyclic.app/CrearSolicitud", {
      method: "POST",
      body: JSON.stringify({
        id_usuario: 1,
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
      .then(response => console.log(response));
      alert("Se ha llamado al colectivo");    
      
  const lat = -34.561144;
  const long = -58.457364;

  try {
    const closestCoord = await CheckDistance(lat, long);
    if (closestCoord) {
      alert("La parada más cercana a "+String(lat)+", "+String(long)+" es: " + String(closestCoord));
    } else {
      alert("No se pudo encontrar la parada más cercana.");
    }
  } catch (error) {
    console.error("Error al buscar la parada más cercana:", error);
    alert("Ocurrió un error al buscar la parada más cercana.");
  }
    }



  return (
    <div>
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
            onClick={handleCallColectivo}>      
            Siguiente
          </button>
        </div>
      </form>
      )}
      {ShowConfirmation && (
        <div className={styles.containerINFO}>
          <button onClick={elegirParadaRandom} className={styles.buttonConfirmation}>Llamar colectivo</button>
          <button className={styles.Atrasbtn} onClick={goBack}>
            <img className={styles.Flecha}src="https://cdn-icons-png.flaticon.com/512/8138/8138445.png" alt='Botón Volver Atras'></img>
          </button>
          <div className={styles.textInfo}>
          <h1><b>Informacion viaje</b></h1>
          <h2>Linea: <b>{linea}</b></h2>
          <h2>Subirse en: <b>{FirstStop}</b></h2>
          <h2>Bajarse en: <b>{LastStop}</b></h2>
          <h2>Distancia: <b>{Distancia}</b>, Duracion: <b>{Duracion}</b></h2>
          </div>
        </div>

      )}
    </div>
  );
};

export default PantallaPrincipal;
