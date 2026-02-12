"use client";

import React from 'react';
import Image from 'next/image';
import { Heart, Award } from 'lucide-react'; // Using Lucide icons as placeholders/fallbacks
import styles from './MissionVision.module.css';

const MissionVision = () => {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                {/* Mission Card */}
                <div className={styles.card}>
                    <div className={styles.iconContainer}>
                        <Heart className={styles.icon} size={32} color="white" fill="white" />
                    </div>
                    <h3 className={styles.title}>Our Mission</h3>
                    <p className={styles.text}>
                        To create a trusted matrimonial platform that enables genuine connections
                        through verified profiles, privacy-focused systems, and respectful matchmaking.
                    </p>
                </div>

                {/* Vision Card */}
                <div className={styles.card}>
                    <div className={styles.iconContainer}>
                        <Award className={styles.icon} size={32} color="white" />
                    </div>
                    <h3 className={styles.title}>Our Vision</h3>
                    <p className={styles.text}>
                        To become one of India's most trusted matrimonial platforms, where relationships
                        are built on honesty, compatibility, and long-term commitment.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default MissionVision;
