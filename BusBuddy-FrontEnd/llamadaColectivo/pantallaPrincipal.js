import React, { useState, useEffect, useRef } from 'react';
import styles from "./alertaChofer.module.css";
import { google } from "google-maps"; // Import google-maps types

const PantallaPrincipal = () => {
  const [address, setAddress] = useState("");
  const [destination, setDestination] = useState("");
  const [ShowConfirmation, setShowConfirmation] = useState(false);
  const [showFirstForm, setShowFirstForm] = useState(true);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);

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

  const handleCallColectivo = (e) => {
    e.preventDefault();
    const newGuide = new window.google.maps.DirectionsService();
    const newRenderer = new window.google.maps.DirectionsRenderer();
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
              }
            });
          });
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
        <div className={styles.container}>
          <button className={styles.buttonConfirmation}>Llamar colectivo</button>
          </div>
      )}
    </div>
  );
};

export default PantallaPrincipal;
