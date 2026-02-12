"use client";
import React from 'react';
import Image from 'next/image';
import styles from './Footer.module.css';
import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

// Using existing public images for the marquee
const GALLERY_IMAGES = [
    '/couple-traditional.png',
    '/couple-formal.png',
    '/couple_1.png',
    '/bride-phone.png',
    '/couple-traditional.png', // Repeat for flow
    '/couple-formal.png',
    '/couple_1.png',
    '/bride-phone.png',
];

const Footer = () => {
    return (
        <footer className={styles.footer}>
            {/* Top Red Bar */}
            <div className={styles.topBar}>
                <span className={styles.topBarText}>
                    Find your life partner among 7 Lakhs Christian Matrimony Brides & Grooms.
                </span>
                <button className={styles.registerBtn}>
                    Register Free
                </button>
            </div>

            {/* Scrolling Marquee Gallery */}
            <div className={styles.marqueeSection}>
                <div className={styles.marqueeContainer}>
                    {/* Duplicating the list to ensure smooth infinite scroll */}
                    {[...GALLERY_IMAGES, ...GALLERY_IMAGES, ...GALLERY_IMAGES].map((src, index) => (
                        <div key={index} className={styles.marqueeItem}>
                            <Image
                                src={src}
                                alt={`Wedding Gallery ${index}`}
                                fill
                                className={styles.marqueeImage}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Footer Content */}
            <div className={styles.mainContent}>

                {/* LET'S TALK Section */}
                <div className={styles.letsTalkContainer}>
                    <h2 className={styles.letsTalkText}>LET’S TALK</h2>
                    <div className={styles.rotatingIconWrapper}>
                        <Image
                            src="/footer-scrolling-icon2.png"
                            alt="Scroll Icon"
                            width={120}
                            height={120}
                            className={styles.rotatingIcon}
                        />
                    </div>
                </div>

                {/* Brand & Address */}
                <div className={styles.bottomSection}>
                    <div className={styles.brandLogo}>
                        <Image
                            src="/logo 1.png"
                            alt="Sindoor Saubhagya"
                            width={220}
                            height={100}
                            className={styles.footerLogo}
                        />

                        <div className={styles.address}>
                            <p>Address: XYZ CITY, 121009</p>
                            <p>phone nos. +91 xxxxxx xxxxx</p>
                        </div>
                    </div>



                    <div className={styles.linksSocialRow}>
                        <nav className={styles.navLinks}>
                            <Link href="/" className={styles.link}>Home</Link>
                            <Link href="/membership" className={styles.link}>Membership</Link>
                            <Link href="/about" className={styles.link}>About Us</Link>
                            <Link href="/profile" className={styles.link}>View Profile</Link>
                        </nav>

                        <div className={styles.socialIcons}>
                            <a href="#" className={styles.iconBtn}><Twitter size={18} /></a>
                            <a href="#" className={styles.iconBtn}><Facebook size={18} /></a>
                            <a href="#" className={styles.iconBtn}><Instagram size={18} /></a>
                            <a href="#" className={styles.iconBtn}><Linkedin size={18} /></a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
