"use client";

import React, { useState, useEffect } from 'react';
import styles from './StatsOfUs.module.css';
import Image from 'next/image';

// SVGs (CalendarIcon kept for generic use if needed, others replaced by images)
// const StarIcon = ... removed
// const CheckBadgeIcon = ... removed

const CalendarIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="white" strokeWidth="2" />
        <line x1="16" y1="2" x2="16" y2="6" stroke="white" strokeWidth="2" />
        <line x1="8" y1="2" x2="8" y2="6" stroke="white" strokeWidth="2" />
        <line x1="3" y1="10" x2="21" y2="10" stroke="white" strokeWidth="2" />
    </svg>
);

const Bubbles = () => {
    // Generate random bubbles with fixed positions for visual stability but animated opacity
    const bubblePositions = [
        { top: '10%', left: '20%', size: '10px', delay: '0s' },
        { top: '20%', right: '15%', size: '15px', delay: '1s' },
        { bottom: '30%', left: '10%', size: '8px', delay: '2s' },
        { bottom: '15%', right: '25%', size: '12px', delay: '0.5s' },
        { top: '40%', left: '5%', size: '6px', delay: '1.5s' },
        { top: '15%', right: '5%', size: '9px', delay: '2.5s' },
    ];

    return (
        <>
            {bubblePositions.map((b, i) => (
                <div
                    key={i}
                    className={styles.bubble}
                    style={{
                        top: b.top,
                        left: b.left,
                        right: b.right,
                        bottom: b.bottom,
                        width: b.size,
                        height: b.size,
                        animationDelay: b.delay
                    }}
                />
            ))}
        </>
    );
};

const StatsOfUs = () => {
    const [activeIndex, setActiveIndex] = useState(1); // Start with middle card active
    // We have 3 items. Indices: 0, 1, 2.

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % 3);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    // Helper to determine class based on relative position
    // Since we only have 3, logic is simple:
    // If active is 0: 0=Active, 1=Next, 2=Prev
    // If active is 1: 1=Active, 2=Next, 0=Prev
    // If active is 2: 2=Active, 0=Next, 1=Prev

    // We can map over the 3 indices
    const items = [0, 1, 2];
    // Replaced missing images with existing ones from public folder
    const coupleImages = ['/couple_1.png', '/couple-traditional.png', '/couple-formal.png'];

    const getPositionClass = (index: number) => {
        if (index === activeIndex) return styles.active;
        if (index === (activeIndex + 1) % 3) return styles.next;
        return styles.prev; // (activeIndex + 2) % 3 is essentially "prev" in a circle of 3
    };

    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <h2 className={styles.title}>
                    Stats <span className={styles.titleHighlight}>Of Us</span>
                </h2>
                <p className={styles.subtitle}>
                    Select from best plans, ensuring a perfect match. Need more or less?<br className="hidden md:block" />
                    Customize your subscription for a seamless fit!
                </p>
            </div>

            <div className={styles.grid}>
                {/* 1. Gallery Card */}
                <div className={`${styles.card} ${styles.galleryCard}`}>
                    <div className={styles.galleryContainer}>
                        <Bubbles />
                        {items.map((i) => (
                            <div key={i} className={`${styles.profileCard} ${getPositionClass(i)}`}>
                                <div className={styles.profileInner}>
                                    {/* Using generated couple image */}
                                    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                        <Image
                                            src={coupleImages[i]}
                                            alt={`Couple ${i + 1}`}
                                            fill
                                            style={{ objectFit: 'cover', borderRadius: '30px' }}
                                            className="rounded-[30px]"
                                        />
                                    </div>
                                    {/* Overlay gradient if needed, or keeping it clean as per request */}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={styles.galleryText}>
                        <h3>Lorem ispum</h3>
                        <p>A strong team of seasoned professionals driving every project forward.</p>
                    </div>
                </div>

                {/* 2. Rating Card */}
                <div className={`${styles.card} ${styles.statCard}`}>
                    <div className={styles.iconCircle}>
                        <Image
                            src="/start icon.png"
                            alt="Rating"
                            width={50}
                            height={50}
                            style={{ objectFit: 'contain' }}
                        />
                    </div>
                    <div className={styles.statValue}>4.5 Rating</div>
                    <div className={styles.statDesc}>Rated among the top by our satisfied users.</div>
                </div>

                {/* 3. Years Card */}
                <div className={`${styles.card} ${styles.statCard}`}>
                    <div className={styles.iconCircle}>
                        <Image
                            src="/check icon.png"
                            alt="Years"
                            width={50}
                            height={50}
                            style={{ objectFit: 'contain' }}
                        />
                    </div>
                    <div className={styles.statValue}>12+ yrs</div>
                    <div className={styles.statDesc}>Decades of insight. A legacy of excellence.</div>
                </div>

                {/* 4. Big Stats Card */}
                <div className={`${styles.card} ${styles.bigCard}`}>
                    <div className={styles.bigCardContent}>
                        <div className={styles.bigTitle}>25K+</div>
                        <div className={styles.statDesc}>Trusted by a growing number of clients from all around the world corners</div>
                    </div>
                    <button className={styles.bookBtn}>
                        <CalendarIcon />
                        Book a Call Now
                    </button>
                </div>
            </div>
        </section>
    );
};

export default StatsOfUs;
