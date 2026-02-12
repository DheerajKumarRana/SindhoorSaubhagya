"use client";

import Image from 'next/image';
import styles from './WhyChooseUs.module.css';

const WhyChooseUs = () => {
    return (
        <section className={styles.section}>
            <div className={styles.gridContainer}>
                {/* Card 1: Header + Image 1 */}
                <div className={`${styles.card} ${styles.headerCard}`} id="wcuo-1">
                    <h2 className={styles.title}>Why Choose<br />Sindoor Saubhagya</h2>
                    <div id="wcu-img-1" className={styles.cardImageContainer}>
                        <Image
                            src="/image 1.png"
                            alt="Why Choose Us"
                            fill
                            className={styles.cardImage}
                        />
                    </div>
                </div>

                {/* Card 2: Verified & Trusted Profiles (Image 2) */}
                <div className={`${styles.card} ${styles.featureCardSmall}`} id="wcuo-2">
                    <div className={styles.cardContent}>
                        <h3 className={styles.featureTitle}>Verified & Trusted Profiles</h3>
                        <p className={styles.featureDesc}>Add details, preferences & family information.</p>
                    </div>
                    <div id="wcu-img-2" className={styles.cardImageContainer}>
                        <Image
                            src="/image 2.png"
                            alt="Verified Profiles"
                            fill
                            className={styles.cardImage}
                        />
                    </div>
                </div>

                {/* Card 3: Quality Matches (Image 3) */}
                <div className={`${styles.card} ${styles.featureCardSmall}`} id="wcuo-3">
                    <div className={styles.cardContent}>
                        <h3 className={styles.featureTitle}>Quality Matches</h3>
                        <p className={styles.featureDesc}>Profiles are manually reviewed for authenticity.</p>
                    </div>
                    <div id="wcu-img-3" className={styles.cardImageContainer}>
                        <Image
                            src="/image 3.png"
                            alt="Quality Matches"
                            fill
                            className={styles.cardImage}
                        />
                    </div>
                </div>

                {/* Card 4: Clear & Transparent Process (Image 4) - Wide Horizontal */}
                <div className={`${styles.card} ${styles.cardHorizontal}`} id="wcuo-4">
                    <div className={styles.cardContent}>
                        <h3 className={styles.featureTitle}>Clear & Transparent Process</h3>
                        <p className={styles.featureDesc}>Chat or express interest in a privacy-controlled environment.</p>
                    </div>
                    <div id="wcu-img-4" className={styles.cardImageContainer}>
                        <Image
                            src="/image 4.png"
                            alt="Clear Process"
                            fill
                            className={styles.cardImage}
                        />
                    </div>
                </div>

                {/* Card 5: Simple, Secure Experience (Image 5) - Wide */}
                <div className={`${styles.card} ${styles.featureCardWide}`} id="wcuo-5">
                    <div className={styles.cardContent}>
                        <h3 className={styles.featureTitle}>Simple, Secure Experience</h3>
                        <p className={styles.featureDesc}>Add details, preferences & family information.</p>
                    </div>
                    <div id="wcu-img-5" className={styles.cardImageContainer}>
                        <Image
                            src="/image 5.png"
                            alt="Secure Experience"
                            fill
                            className={styles.cardImage}
                        />
                    </div>
                </div>

            </div>
        </section>
    );
};

export default WhyChooseUs;
