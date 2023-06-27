import React from "react";
import styles from "./alertaChofer.module.css";


const AlertaChofer = () => {
    return (
    <div>
      <iframe className={styles.mapa} src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d64335.07666590948!2d-58.44772896163354!3d-34.580385620490944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sGalp%C3%B3n%20de%20Ropa!5e0!3m2!1ses!2sar!4v1661524962941!5m2!1ses!2sar" ></iframe>
    <form className={styles.container}>
        <input 
        type="text"
        placeholder="Añadir ubicación"
        className={styles.inputUbi}
            />
               <button type="submit" className={styles.button}>
            Llamar colectivo
            </button>
    </form>
    </div>
    );
    }

export default AlertaChofer;