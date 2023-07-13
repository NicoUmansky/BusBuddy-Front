import React, { useState, useEffect } from 'react';
import styles from "./alertaChofer.module.css";

const PantallaPrincipal = () => {
  const [address, setAddress] = useState("");
  const [destination, setDestination] = useState("");
  const [showDestination, setShowDestination] = useState(false);
  const [showOrigin, setShowOrigin] = useState(true);

  useEffect(() => {
    initAutoComplete("inputUbi", setAddress);
    initAutoComplete("inputDestino", setDestination);
  }, []);

  const initAutoComplete = (inputId, setAddressCallback) => {
    if (google && google.maps) {
      const input = document.getElementById(inputId);
      const options = {
        componentRestrictions: { country: "ar" }
      };
      const autocomplete = new google.maps.places.Autocomplete(input, options);

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
    console.log(address, destination, linea);
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
            const map = document.querySelector("iframe").setAttribute("src", "https://maps.google.com/maps?q=" + address + "&t=&z=13&ie=UTF8&iwloc=&output=embed");
          });
      });
    } else {
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
