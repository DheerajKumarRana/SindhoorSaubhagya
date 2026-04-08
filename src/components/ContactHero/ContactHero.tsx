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
                        No automated replies, no endless wait times. When you reach out to Sindoor Saubhagya you speak to a real person who understands what this search means to you and is genuinely here to help.
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
