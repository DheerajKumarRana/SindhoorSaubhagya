"use client";

import Image from 'next/image';
import Link from 'next/link';
import styles from './Hero.module.css';
import { Heart } from 'lucide-react';
import { useModal } from '@/context/ModalContext';
import { useState } from 'react';

const Hero = () => {
    const { openSignUp } = useModal();
    const [profileFor, setProfileFor] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        openSignUp({
            profileFor,
            email,
            phone,
            password
        });
    };

    return (
        <section className={styles.heroSection}>
            <div className={styles.heroBackground}>
                <Image
                    src="/hero-bg.png"
                    alt="Indian Wedding Couple"
                    fill
                    priority
                    className={styles.bgImage}
                />
            </div>

            <div className={styles.heroContent}>
                {/* Left Text Content */}
                <div className={styles.textContent}>
                    <h1 className={styles.headline}>
                        Find Your Life <span className={styles.highlightHeart}>❤</span> Partner,<br />
                        Not Just a Match
                    </h1>
                    <p className={styles.subHeadline}>
                        A trusted matrimonial platform helping families and individuals connect with verified, faith-aligned, and serious profiles.
                    </p>
                    <div className={styles.actionButtons}>
                        <button className={styles.btnPrimary} onClick={() => openSignUp()}>Get Started Free</button>
                        <Link href="/membership" className={styles.btnSecondary}>Our Plans</Link>
                    </div>
                </div>

                {/* Right Registration Form */}
                <div className={styles.formCard}>
                    <h3 className={styles.formTitle}>Register and find your soulmate</h3>

                    <form onSubmit={handleRegister}>
                        <div className={styles.formGroup}>
                            <span className={styles.inputLabel} style={{ top: '-8px', fontSize: '0.75rem' }}>Create Profile for</span>
                            <select
                                className={styles.formSelect}
                                value={profileFor}
                                onChange={(e) => setProfileFor(e.target.value)}
                            >
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
                            <input
                                type="email"
                                placeholder="Email address"
                                className={styles.formInput}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <input
                                type="tel"
                                placeholder="Phone number"
                                className={styles.formInput}
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <input
                                type="password"
                                placeholder="Create Password"
                                className={styles.formInput}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className={styles.btnRegister}>
                            Register for free
                        </button>
                    </form>
                </div>
            </div>

            <div className={styles.bottomBar}>
                <div className={styles.bottomBarContent}>
                    <span>Fastest Growing Matchmaking Service</span>
                    <span className={styles.separator}>|</span>
                    <span>
                        <span className={styles.stars}>★★★★★</span>
                        Ratings on Playstore by 2.4 lakh users
                    </span>
                    <span className={styles.separator}>|</span>
                    <span>5 Lakh Success Stories</span>
                </div>
            </div>
        </section>
    );
};

export default Hero;
