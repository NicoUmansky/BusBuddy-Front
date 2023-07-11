import React, { useState } from 'react';
import styles from "./alertaChofer.module.css";


const PantallaPrincipal = () => {
  const [address, setAddress] = useState("");

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
            document.getElementById("inputUbi").setAttribute("defaultValue", address);
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
          onChange={(e) => setAddress(e.target.value)}
          value={address}
          id='inputUbi'
          className={styles.inputUbi}
        />
        <button id="btnUbiActual" className={styles.btnUbiActual} onClick={getLocation}><b>Ubicación Actual</b></button>
        <label className={styles.text}> ó </label>
        <button type="submit" className={styles.button}><a href="./alertaChofer">Siguiente</a></button>
      </form>
    </div>
  );
};
export default PantallaPrincipal