"use client";

import React from 'react';
import Image from 'next/image';
import styles from './ContactHero.module.css';

const ContactHero = () => {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                {/* Left Content */}
                <div className={styles.contentSide}>
                    <h1 className={styles.title}>
                        Have <span className={styles.titleSpan}>a</span> <br />
                        Question?
                    </h1>
                    <p className={styles.subtitle}>
                        We're here to help you find the right match
                    </p>
                </div>

                {/* Right Image */}
                <div className={styles.imageSide}>
                    <Image
                        src="/CONTACT-US-HERO.jpg"
                        alt="Couple"
                        fill
                        className={styles.heroImage}
                        priority
                    />
                </div>
            </div>
        </section>
    );
};

export default ContactHero;
