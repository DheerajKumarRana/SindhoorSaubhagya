"use client";

import React from 'react';
import { Heart, Award } from 'lucide-react';
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
                    <h3 className={styles.title}>Vision</h3>
                    <p className={styles.text}>
                        To build a space where finding a life partner feels clear, respectful, and rooted in trust-bringing together individuals and families who value meaningful relationships, shared understanding, and a lifelong commitment.
                    </p>
                </div>

                {/* Vision Card */}
                <div className={styles.card}>
                    <div className={styles.iconContainer}>
                        <Award className={styles.icon} size={32} color="white" />
                    </div>
                    <h3 className={styles.title}>Mission</h3>
                    <p className={styles.text}>
                        Our mission is to make the journey of finding the right partner simple and genuine by connecting like-minded individuals, focusing on true compatibility, and ensuring a safe, private, and respectful experience at every step.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default MissionVision;
