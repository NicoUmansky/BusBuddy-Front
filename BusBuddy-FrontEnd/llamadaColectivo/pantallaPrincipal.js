import React, { useState, useEffect, useRef } from 'react';
import styles from "./alertaChofer.module.css";
import { google } from "google-maps";


const PantallaPrincipal = () => {
  const [address, setAddress] = useState("");
  const [destination, setDestination] = useState("");
  const [showDestination, setShowDestination] = useState(false);
  const [showOrigin, setShowOrigin] = useState(true);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);


  const mapContainerRef = useRef(null);
  let map;
  let googleMapsInitialized = false; // Flag to indicate if the Google Maps API is loaded
  const key = process.env.NEXT_PUBLIC_API_KEY;

  useEffect(() => {
    initAutoComplete("inputUbi", setAddress);
    initAutoComplete("inputDestino", setDestination);

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
    if (!map) {
      map = new window.google.maps.Map(mapContainerRef.current, {
        center: { lat: -34.5702515, lng: -58.4533877 },
        zoom: 13,
      });
    }
  };
  const initAutoComplete = (inputId, setAddressCallback) => {
    if (google && google.maps) {
      const input = document.getElementById(inputId);
      const options = {
        componentRestrictions: { country: "ar" }
      };
      const autocomplete = new window.google.maps.places.Autocomplete(input, options);

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place && place.formatted_address) {
          setAddressCallback(place.formatted_address.split(",")[0]);
        }
      });
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "inputUbi") {
      setAddress(value);
    } else if (id === "inputDestino") {
      setDestination(value);
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (address === "") {
      alert("Debe ingresar una dirección");
      return;
    }
    else{
    setShowDestination(true);
    setShowOrigin(false);
    }

  };
const handleCallColectivo = (e) => {
  e.preventDefault();
  const linea = document.getElementById("inputLinea").value;
  fetch("http://localhost:3001/Findlinea/" + linea)
    .then(response => response.json())
    .then(response => {
      var idlinea = response;
      const newSoli = fetch("http://localhost:3001/CrearSolicitud", {
        method: "POST",
        body: JSON.stringify({
          id_linea: idlinea,
          direccionOrigen: address,
          direccionDestino: destination,
        }),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
        .then(response => {
          console.log(response);
          const newGuide = new window.google.maps.DirectionsService();
          const newRenderer = new window.google.maps.DirectionsRenderer();
          newRenderer.setMap(map);
          newGuide.route(
            {
              origin: address,
              destination: destination,
              travelMode: window.google.maps.TravelMode.TRANSIT,
              transitOptions: {
                modes: [window.google.maps.TransitMode.BUS],
              },
              provideRouteAlternatives: true,
            },
            (response, status) => {
              if (status === "OK") {
                  
                // response.routes.forEach((route) => {
                  console.log("Hora de salida: " + response.routes[0].legs[0].departure_time.text + " Hora de llegada: " + response.routes[0].legs[0].arrival_time.text +  " Duracion: " + response.routes[0].legs[0].duration.text + " Distancia: " + response.routes[0].legs[0].distance.text);
                  console.log(response);
                  response.routes[0].legs[0].steps.forEach((step) => {
                      console.log("Instrucciones:");
                    console.log(step.instructions);
                });     
                  newRenderer.setDirections(response);
                  setDirectionsRenderer(newRenderer); // Update the state with the new DirectionsRenderer
                } 
                else {
                window.alert("Directions request failed due to " + status);
                console.log(directionsRenderer);
                
              }
            }
          );
        });
    });
};


  const getLocation = (e) => {
    e.preventDefault();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        fetch("http://localhost:3001/findLocation/" + latitude + "," + longitude)
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
return (
    <div>
      <div ref={mapContainerRef} className={styles.mapContainer} />

      <form className={styles.container}>
        {showOrigin && (
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
            <label className={styles.text}> ó </label>
            <button
              type="button"
              className={styles.button}
              onClick={handleNext}
            >
              Siguiente
            </button>
          </div>
        )}
        {showDestination && (
          <div>
            <input
              type="text"
              placeholder="Añadir destino"
              defaultValue={destination}
              id="inputDestino"
              className={styles.inputUbi}
              autoComplete="off"
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Linea de colectivo"
              id="inputLinea"
              className={styles.inputlinea}
              autoComplete="off"
            />

            <button
              type="submit"
              className={styles.button}
              onClick={handleCallColectivo}
            >
              Llamar Colectivo
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default PantallaPrincipal;