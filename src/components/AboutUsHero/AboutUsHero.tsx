"use client";

import React from 'react';
import styles from './AboutUsHero.module.css';

const AboutUsHero = () => {
    return (
        <section className={styles.heroSection}>
            <div className={styles.overlay}></div>
            <h1 className={styles.title}>About Us</h1>
        </section>
    );
};

export default AboutUsHero;
