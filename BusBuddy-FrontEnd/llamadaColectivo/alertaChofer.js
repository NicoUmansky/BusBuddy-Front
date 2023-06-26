import React from "react";
import styles from "./alertaChofer.module.css";
import "./MapaEJ/ImgMapaEJ.png"

const AlertaChofer = () => {
    return (
    <div>
    <img src="./MapaEJ/ImgMapaEJ.png">
    </img>
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