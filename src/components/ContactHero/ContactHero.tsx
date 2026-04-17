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
                    <h1 className={styles.title}>Get in Touch</h1>
                    <p className={styles.subtitle}>
                        When you reach out to Sindoor Saubhagaya, you connect with a real person who understands how important this journey is and is here to help you with care.
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
