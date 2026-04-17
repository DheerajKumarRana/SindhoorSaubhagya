"use client";

import React from 'react';
import Image from 'next/image';
import styles from './WhoAreWe.module.css';

const WhoAreWe = () => {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                {/* Left Side - Image */}
                <div className={styles.imageWrapper}>
                    <Image
                        src="/couple-formal.png"
                        alt="Who are we"
                        fill
                        className={styles.image}
                    />
                </div>

                {/* Right Side - Content */}
                <div className={styles.content}>
                    <h2 className={styles.heading}>Built around something meaningful</h2>
                    <p className={styles.description}>
                        At Sindoor Saubhagaya, we believe marriage is not just about finding someone - it&apos;s about finding the right person to share your life with.
                    </p>
                    <p className={styles.description}>
                        In our culture, Sindoor is more than a tradition. It represents commitment, respect, and a lifelong bond.
                    </p>
                    <p className={styles.description}>That belief is at the heart of everything we do.</p>

                    <div className={styles.divider} />

                    <h3 className={styles.sectionTitle}>WHO WE ARE</h3>
                    <p className={styles.description}>
                        Sindoor Saubhagaya is a matrimonial platform created for individuals and families who are serious about marriage. We focus on keeping the process simple, respectful, and genuine so you can concentrate on what truly matters: building a meaningful connection. No distractions. No unnecessary complexity. Just a space where real intentions meet.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default WhoAreWe;
