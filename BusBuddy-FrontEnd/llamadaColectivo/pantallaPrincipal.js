import React, { useState, useEffect } from 'react';
import styles from "./alertaChofer.module.css";


const PantallaPrincipal = () => {
  const [address, setAddress] = useState("");
  const [destination, setDestination] = useState("");
  const [showDestination, setShowDestination] = useState(false);
  const [showOrigin, setShowOrigin] = useState(true);

  useEffect(() => {
    initAutoComplete();
    initDestinationAutocomplete();
  }, []);

  const initDestinationAutocomplete = () => {
    if (google && google.maps) {
      const input = document.getElementById("inputDestino");
      const options = {
        componentRestrictions: { country: "ar" }
      };
      const autocomplete = new google.maps.places.Autocomplete(input, options);
  
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place && place.formatted_address) {
          setDestination(place.formatted_address);
        }
      });
    }
  };
  
  const initAutoComplete = () => {
    if (google && google.maps) {
      const input = document.getElementById("inputUbi");
      const options = {
        componentRestrictions: { country: "ar" }
};
      const autocomplete = new google.maps.places.Autocomplete(input, options);

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place && place.formatted_address) {
          setAddress(place.formatted_address);
        }
      });
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    setShowDestination(true);
    setShowOrigin(false);
  };
  const handleCallColectivo = (e) => {
    e.preventDefault();
    const origin = document.getElementById("inputUbi").value;
    const destination = document.getElementById("inputDestino").value;
    console.log(origin, destination);
  };

  const getLocation = (e) => {
    e.preventDefault();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        // console.log(position.coords.latitude, position.coords.longitude);
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        fetch("http://localhost:3001/findLocation/" + latitude + "," + longitude)
          .then(response => response.json())
          .then(response => {
            const address = String(response).split(",")[0];
            setAddress(address);
            document.getElementById("inputUbi").setAttribute("value", address);
            const map = document.querySelector("iframe").setAttribute("src", "https://maps.google.com/maps?q=" + address + "&t=&z=13&ie=UTF8&iwloc=&output=embed");
          });

      });
    }
    else {
      alert("Geolocation is not supported by this browser.");
    }
  };
  return (
    <div>
      <iframe
        className={styles.mapa}
        src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d64335.07666590948!2d-58.44772896163354!3d-34.580385620490944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sGalp%C3%B3n%20de%20Ropa!5e0!3m2!1ses!2sar!4v1661524962941!5m2!1ses!2sar"
      ></iframe>
      <form className={styles.container}>
        <input
          type="text"
          placeholder="Añadir ubicación"
          defaultValue={address}
          id="inputUbi"
          className={styles.inputUbi}
          autoComplete="off"
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
        {showDestination && (
          <div>
            <input
              type="text"
              placeholder="Añadir destino"
              defaultValue={destination}
              id="inputDestino"
              className={styles.inputUbi}
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