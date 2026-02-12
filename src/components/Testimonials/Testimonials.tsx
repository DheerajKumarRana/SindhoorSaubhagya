"use client";

import Image from 'next/image';
import styles from './Testimonials.module.css';

// Mock Data
const testimonials = [
    {
        id: 1,
        text: "I wanted a life partner who shared my values and beliefs, not just interests. The matching system helped me connect with someone who truly understands me. Today, we are happily married.",
        name: "Rohan & Shree",
        role: "Couple",
        image: "/groom-phone.png" // Placeholder
    },
    {
        id: 2,
        text: "Finding someone who understands your family values is hard. Sindoor Saubhagya made it easy for us to connect on a deeper level right from the start.",
        name: "Arjun & Sneha",
        role: "Couple",
        image: "/bride-phone.png" // Placeholder
    },
    {
        id: 3,
        text: "The verification process gave us so much peace of mind. We knew we were talking to genuine people who were serious about marriage.",
        name: "Vikram & Priya",
        role: "Couple",
        image: "/couple-formal.png" // Placeholder
    },
    {
        id: 4,
        text: "We met through the app and instantly clicked. The detailed profiles helped us know so much about each other before we even met.",
        name: "Rahul & Anjali",
        role: "Couple",
        image: "/couple-traditional.png" // Placeholder
    },
];

// Duplicate data to ensure seamless scroll loop
const marqueeData = [...testimonials, ...testimonials, ...testimonials];

const Testimonials = () => {
    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <h2 className={styles.title}>
                    What Our <span className={styles.titleHighlight}>Customers Say</span>
                </h2>
                <p className={styles.subtitle}>
                    Real stories from people around the world using our platform to build, grow, and connect.
                </p>
            </div>

            <div className={styles.marqueeContainer}>
                {/* Row 1: Left to Right (Moving Right means translateX goes positive? Usually 'Standard' flow is Left to Right (reading), so Left scrolling means content moves Left. 
                    User said "first row moving in right direction". 
                    Moving RIGHT means content shifts >>>. 
                    CSS animation 'scrollRight' handles this.
                */}
                <div className={styles.marqueeRow}>
                    <div className={`${styles.marqueeRow} ${styles.scrollRight}`}>
                        {marqueeData.map((item, index) => (
                            <div key={`row1-${index}`} className={styles.card}>
                                <div className={styles.stars}>★★★★★</div>
                                <p className={styles.quote}>"{item.text}"</p>
                                <div className={styles.author}>
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        width={48}
                                        height={48}
                                        className={styles.avatar}
                                    />
                                    <div className={styles.authorInfo}>
                                        <span className={styles.authorName}>{item.name}</span>
                                        <span className={styles.authorRole}>{item.role}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Row 2: Right to Left (Opposite) */}
                <div className={styles.marqueeRow}>
                    <div className={`${styles.marqueeRow} ${styles.scrollLeft}`}>
                        {marqueeData.map((item, index) => (
                            <div key={`row2-${index}`} className={styles.card}>
                                <div className={styles.stars}>★★★★★</div>
                                <p className={styles.quote}>"{item.text}"</p>
                                <div className={styles.author}>
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        width={48}
                                        height={48}
                                        className={styles.avatar}
                                    />
                                    <div className={styles.authorInfo}>
                                        <span className={styles.authorName}>{item.name}</span>
                                        <span className={styles.authorRole}>{item.role}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
