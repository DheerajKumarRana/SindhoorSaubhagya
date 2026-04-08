"use client";

import React, { useState, useEffect, useRef } from 'react';
import styles from './StatsOfUs.module.css';
import Image from 'next/image';

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
    const [ratingCount, setRatingCount] = useState(0);
    const [yearsCount, setYearsCount] = useState(0);
    const [profilesCount, setProfilesCount] = useState(0);
    const hasAnimatedRef = useRef(false);
    const sectionRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % 3);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const animateCounters = () => {
            const duration = 3200;
            const ratingTarget = 4.9;
            const yearsTarget = 8;
            const profilesTarget = 500000;
            const start = performance.now();

            const tick = (now: number) => {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);

                setRatingCount(Number((ratingTarget * eased).toFixed(1)));
                setYearsCount(Math.round(yearsTarget * eased));
                setProfilesCount(Math.round(profilesTarget * eased));

                if (progress < 1) {
                    requestAnimationFrame(tick);
                } else {
                    setRatingCount(ratingTarget);
                    setYearsCount(yearsTarget);
                    setProfilesCount(profilesTarget);
                }
            };

            requestAnimationFrame(tick);
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasAnimatedRef.current) {
                        hasAnimatedRef.current = true;
                        animateCounters();
                    }
                });
            },
            { threshold: 0.25 }
        );

        observer.observe(section);
        return () => observer.disconnect();
    }, []);

    const formatProfilesCount = (value: number) => {
        if (value <= 0) return '0';
        if (value < 100000) return `${value}`;
        const lakhValue = value / 100000;
        const formatted = Number.isInteger(lakhValue)
            ? `${lakhValue}`
            : lakhValue.toFixed(1).replace(/\.0$/, '');
        return `${formatted} Lakh`;
    };

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
        <section className={styles.section} ref={sectionRef}>
            <div className={styles.header}>
                <h2 className={styles.title}>
                    Where Things <span className={styles.titleHighlight}>Stand Today</span>
                </h2>
                <p className={styles.subtitle}>
                    These numbers reflect the community that has formed around this platform over the years. We share them not to impress but because we think they are worth knowing.
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
                        <h3>Community Snapshot</h3>
                        <p>Real outcomes over the years, built on trust and serious intent.</p>
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
                    <div className={styles.statValue}>{ratingCount.toFixed(1)}</div>
                    <div className={styles.statDesc}>Average Rating<br />Rated by members who have used the platform and shared their honest experience.</div>
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
                    <div className={styles.statValue}>{yearsCount} Years</div>
                    <div className={styles.statDesc}>In This Space<br />Eight years of learning, improving, and staying focused on what actually matters.</div>
                </div>

                {/* 4. Big Stats Card */}
                <div className={`${styles.card} ${styles.bigCard}`}>
                    <div className={styles.bigCardContent}>
                        <div className={styles.bigTitle}>{formatProfilesCount(profilesCount)}+</div>
                        <div className={styles.statDesc}>Marriages Attributed<br />Couples who met here and chose to spend their lives together. Each one means a great deal to us.</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StatsOfUs;
