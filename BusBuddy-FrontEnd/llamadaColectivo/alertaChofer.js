import React from "react";
import styles from "./alertaChofer.module.css";

const AlertaChofer = () => {
    return (
        <div className={styles.container}>
        <h2 className={styles.title}>Alerta al chofer</h2>
        <p className={styles.text}>
            ¿Querés que el chofer sepa que estás esperando el colectivo?
        </p>
        <button type="submit" className={styles.button}>
            Alertar
        </button>
        </div>
    );
    }