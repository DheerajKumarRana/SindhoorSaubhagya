"use client";

import React from 'react';
import styles from './ContactUs.module.css';
import Image from 'next/image';

const ContactUs = () => {
    // Testimonials data
    const testimonials = [
        {
            text: "I wanted a life partner who shared my values and beliefs. The matching system helped me connect with someone who truly understands me.",
            name: "Rohan & Shree",
            role: "Couple",
            image: "/groom-phone.png"
        },
        {
            text: "Finding someone who understands your family values is hard. Sindoor Saubhagya made it easy for us.",
            name: "Arjun & Sneha",
            role: "Couple",
            image: "/bride-phone.png"
        },
        {
            text: "The verification process gave us so much peace of mind. We knew we were talking to genuine people.",
            name: "Vikram & Priya",
            role: "Couple",
            image: "/couple-formal.png"
        },
        {
            text: "Detailed profiles helped us know so much about each other before we even met.",
            name: "Rahul & Anjali",
            role: "Couple",
            image: "/couple-traditional.png"
        },
    ];

    // Duplicate for smooth loop
    const marqueeData = [...testimonials, ...testimonials, ...testimonials];

    return (
        <section className={styles.section}>
            {/* Header */}
            <div className={styles.titleContainer}>
                <h2 className={styles.title}>
                    Contact Us <span className={styles.titleHighlight}>Now</span>
                </h2>
            </div>

            {/* Background Marquee Layer */}
            <div className={styles.marqueeLayer}>
                <div className={styles.marqueeContainer}>
                    {marqueeData.map((item, index) => (
                        <div key={index} className={styles.testimonialCard}>
                            <div className={styles.stars}>★★★★★</div>
                            <p className={styles.testimonialText}>"{item.text}"</p>
                            <div className={styles.authorSection}>
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={48}
                                    height={48}
                                    className={styles.avatar}
                                />
                                <div className={styles.authorInfo}>
                                    <span className={styles.testimonialAuthor}>{item.name}</span>
                                    <span className={styles.testimonialRole}>{item.role}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Animated Icons - Scattered manually for now, or could map */}

            {/* Stars */}
            <div className={`${styles.animatedIcon} ${styles.anim1}`} style={{ top: '20%', left: '15%', width: '60px', height: '60px' }}>
                <Image src="/Star 8.png" alt="Star" fill style={{ objectFit: 'contain' }} />
            </div>

            <div className={`${styles.animatedIcon} ${styles.anim2}`} style={{ top: '60%', left: '10%', width: '40px', height: '40px' }}>
                <Image src="/Star 8.png" alt="Star" fill style={{ objectFit: 'contain' }} />
            </div>

            <div className={`${styles.animatedIcon} ${styles.anim3}`} style={{ top: '30%', right: '20%', width: '50px', height: '50px' }}>
                <Image src="/Star 8.png" alt="Star" fill style={{ objectFit: 'contain' }} />
            </div>

            <div className={`${styles.animatedIcon} ${styles.anim4}`} style={{ bottom: '20%', right: '10%', width: '35px', height: '35px' }}>
                <Image src="/Star 8.png" alt="Star" fill style={{ objectFit: 'contain' }} />
            </div>

            {/* Suns */}
            <div className={`${styles.animatedIcon} ${styles.anim2}`} style={{ top: '15%', right: '15%', width: '55px', height: '55px' }}>
                <Image src="/sun.png" alt="Sun" fill style={{ objectFit: 'contain' }} />
            </div>

            <div className={`${styles.animatedIcon} ${styles.anim5}`} style={{ bottom: '30%', left: '20%', width: '45px', height: '45px' }}>
                <Image src="/sun.png" alt="Sun" fill style={{ objectFit: 'contain' }} />
            </div>

            {/* Rainbow Background - Single Image */}
            <div className={styles.rainbowSingle}>
                <Image src="/rainbow992.png" alt="Rainbow Background" fill style={{ objectFit: 'contain' }} />
            </div>

            {/* 3. Registration Form */}
            <div className={styles.formLayer}>
                <div className={styles.formCard}>
                    <h3 className={styles.formTitle}>Register and find your soulmate</h3>

                    <form>
                        <div className={styles.formGroup}>
                            <span className={styles.inputLabel} style={{ top: '-8px', fontSize: '0.75rem' }}>Create Profile for</span>
                            <select className={styles.formSelect} defaultValue="">
                                <option value="" disabled>Select Profile For</option>
                                <option value="self">Self</option>
                                <option value="son">Son</option>
                                <option value="daughter">Daughter</option>
                                <option value="brother">Brother</option>
                                <option value="sister">Sister</option>
                                <option value="friend">Friend</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <input type="email" placeholder="Email address" className={styles.formInput} />
                        </div>

                        <div className={styles.formGroup}>
                            <input type="tel" placeholder="Phone number" className={styles.formInput} />
                        </div>

                        <div className={styles.formGroup}>
                            <input type="password" placeholder="Create Password" className={styles.formInput} />
                        </div>

                        <button type="submit" className={styles.btnRegister}>
                            Register for free
                        </button>
                    </form>
                </div>
            </div>

        </section>
    );
};

export default ContactUs;
