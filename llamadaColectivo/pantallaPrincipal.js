import React, { useState, useEffect, useRef } from 'react';
import styles from "./alertaChofer.module.css";
import { google } from "google-maps"; // Import google-maps types

const PantallaPrincipal = () => {
  var [address, setAddress] = useState("");
  var [destination, setDestination] = useState("");
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
  const handleCallColectivo = (e) => {
    e.preventDefault();
    // alert(SegundoIntento);

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
          setDirectionsRenderer(newRenderer); // Update the state with the new DirectionsRenderer
          setShowConfirmation(true);
          setShowFirstForm(false);
        } else {
          SegundoIntento = true;
          if(SegundoIntento == true){
            address = address + ", CABA";
            destination = destination + ", CABA";
            handleCallColectivo(e);
            SegundoIntento = false;     
      
          }
          
          // window.alert("Directions request failed due to " + status);
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
          var parada = String(response);
          console.log(parada);
          const paradaI = parada.split(",")[0];
          setParadaI(parseInt(paradaI));
          const paradaD = parada.split(",")[1];
         const call = llamarColectivo(paradaI, paradaD);
        return call;
        });
      
  }
  
async function llamarColectivo(paradaI, paradaD){
    const soli = fetch("https://breakable-turtleneck-shirt-foal.cyclic.app/CreateSolicitud", {
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
          interno: "3056",
          paradaInicio: paradaI,          
        }),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
        .then(response => console.log(response));
         mapContainerRef.current.className = "alertaChofer_mapContainer__p0zwy"
        setNextPage(false);
        setShowFirstForm(true);
        initializeMap();
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
      {NextPage && (
        <div className={styles.containerINFOFinal}>
          <h2 className={styles.llegadaBus}>El colectivo llegará a las {HoraSubida} aproximadamente</h2>
          <h2 className={styles.llegadaFinal}>Llegará a su destino a las <b>{HoraBajada}</b> aproximadamente</h2>
          <button className={styles.Cancelarbtn} onClick={CancelRequest}>CANCELAR VIAJE</button>
    </div>
      )}
    </div>
  
  );
};


export default PantallaPrincipal;
