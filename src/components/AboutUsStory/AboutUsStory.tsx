"use client";

import React from 'react';
import Image from 'next/image';
import styles from './AboutUsStory.module.css';

const AboutUsStory = () => {
    return (
        <section className={styles.section}>
            {/* Background Animations */}
            {/* Stars - Reusing animations logic but keeping cards static */}
            <div className={`${styles.animatedIcon} ${styles.anim1}`} style={{ width: '40px', height: '40px' }}>
                <Image src="/Star 8.png" alt="Star" fill style={{ objectFit: 'contain' }} />
            </div>
            <div className={`${styles.animatedIcon} ${styles.anim2}`} style={{ width: '50px', height: '50px' }}>
                <Image src="/Star 8.png" alt="Star" fill style={{ objectFit: 'contain' }} />
            </div>
            <div className={`${styles.animatedIcon} ${styles.anim3}`} style={{ width: '35px', height: '35px' }}>
                <Image src="/Star 8.png" alt="Star" fill style={{ objectFit: 'contain' }} />
            </div>
            <div className={`${styles.animatedIcon} ${styles.anim4}`} style={{ width: '45px', height: '45px' }}>
                <Image src="/Star 8.png" alt="Star" fill style={{ objectFit: 'contain' }} />
            </div>

            <div className={styles.container}>
                {/* Central Image */}
                <div className={styles.imageContainer}>
                    <Image
                        src="/couple-traditional.png"
                        alt="Our Story"
                        fill
                        className={styles.mainImage}
                    />
                </div>

                {/* Stat Cards - Positioned absolutely around the image */}

                {/* Top Left - Rating */}
                <div className={`${styles.card} ${styles.cardTopLeft}`}>
                    <div className={styles.iconCircle}>
                        <Image src="/start icon.png" alt="Rating" width={45} height={45} />
                    </div>
                    <div className={styles.cardContent}>
                        <h3>4.5 Rating</h3>
                        <p>Rated among the top by our satisfied users.</p>
                    </div>
                </div>

                {/* Top Right - Years */}
                <div className={`${styles.card} ${styles.cardTopRight}`}>
                    <div className={styles.iconCircle}>
                        <Image src="/check icon.png" alt="Years" width={45} height={45} />
                    </div>
                    <div className={styles.cardContent}>
                        <h3>12+ yrs</h3>
                        <p>Decades of insight. A legacy of excellence.</p>
                    </div>
                </div>

                {/* Bottom Left - Profiles */}
                <div className={`${styles.card} ${styles.cardBottomLeft}`}>
                    <div className={styles.iconCircle}>
                        <Image src="/check icon.png" alt="Profiles" width={45} height={45} />
                    </div>
                    <div className={styles.cardContent}>
                        <h3>1.2k+ profiles</h3>
                        <p>Decades of insight. A legacy of excellence.</p>
                    </div>
                </div>

                {/* Bottom Right - Connected */}
                <div className={`${styles.card} ${styles.cardBottomRight}`}>
                    <div className={styles.iconCircle}>
                        <Image src="/start icon.png" alt="Connected" width={45} height={45} />
                    </div>
                    <div className={styles.cardContent}>
                        <h3>100+ connected</h3>
                        <p>Rated among the top by our satisfied users.</p>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default AboutUsStory;
