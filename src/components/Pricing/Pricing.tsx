"use client";

import styles from './Pricing.module.css';
import Image from 'next/image';
import { useModal } from '@/context/ModalContext';

const CheckIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6L9 17L4 12" stroke="#666666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const CheckIconPremium = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6L9 17L4 12" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);


const Pricing = () => {
    const { openSignUp } = useModal();

    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <h2 className={styles.title}>
                    Choose the <span className={styles.titleHighlight}>Right Plan!</span>
                </h2>
                <p className={styles.subtitle}>
                    Select from best plans, ensuring a perfect match. Need more or less?<br className="hidden md:block" />
                    Customize your subscription for a seamless fit!
                </p>
            </div>

            <div className={styles.grid}>
                {/* Basic Plan */}
                <div className={styles.card}>
                    <h3 className={styles.planName}>Basic</h3>
                    <div className={styles.priceContainer}>
                        <span className={styles.planName}>Rs</span>
                        <span className={styles.price}>1000</span>
                        <span className={styles.period}>/forever</span>
                    </div>
                    <p className={styles.description}>Perfect for exploring your compatibility.</p>

                    <button className={`${styles.button} ${styles.buttonOutline}`} onClick={openSignUp}>Find Matches</button>

                    <hr className={styles.divider} />

                    <ul className={styles.featuresList}>
                        <li className={styles.featureItem}><CheckIcon /> Profile Creation</li>
                        <li className={styles.featureItem}><CheckIcon /> 10 Daily Matches</li>
                        <li className={styles.featureItem}><CheckIcon /> Basic Matching</li>
                        <li className={styles.featureItem}><CheckIcon /> Limited Support</li>
                        <li className={styles.featureItem}><CheckIcon /> Standard Security</li>
                    </ul>
                </div>

                {/* Premium Plan */}
                <div className={styles.card}>
                    <span className={styles.popularBadge}>Popular</span>
                    <h3 className={styles.planName}>Premium</h3>
                    <div className={styles.priceContainer}>
                        <span className={styles.planName}>Rs</span>
                        <span className={styles.price}>1500</span>
                        <span className={styles.period}>/per month</span>
                    </div>
                    <p className={styles.description}>Ideal for finding a meaningful connection.</p>

                    <button className={`${styles.button} ${styles.buttonFilled}`} onClick={openSignUp}>Find Matches</button>

                    <hr className={styles.divider} />

                    <ul className={styles.featuresList}>
                        <li className={styles.featureItem}><CheckIconPremium /> Everything in Basic</li>
                        <li className={styles.featureItem}><CheckIconPremium /> Unlimited Matches</li>
                        <li className={styles.featureItem}><CheckIconPremium /> Advanced Matching</li>
                        <li className={styles.featureItem}><CheckIconPremium /> Priority Support</li>
                        <li className={styles.featureItem}><CheckIconPremium /> Enhanced Security</li>
                    </ul>
                </div>

                {/* Ultimate Plan */}
                <div className={styles.card}>
                    <h3 className={styles.planName}>Ultimate</h3>
                    <div className={styles.priceContainer}>
                        <span className={styles.planName}>Rs</span>
                        <span className={styles.price}>2000</span>
                        <span className={styles.period}>/per month</span>
                    </div>
                    <p className={styles.description}>For serious seekers looking for their soulmate.</p>

                    <button className={`${styles.button} ${styles.buttonOutline}`} onClick={openSignUp}>Contact Us</button>

                    <hr className={styles.divider} />

                    <ul className={styles.featuresList}>
                        <li className={styles.featureItem}><CheckIcon /> Personalized Guidance</li>
                        <li className={styles.featureItem}><CheckIcon /> Unlimited Matches</li>
                        <li className={styles.featureItem}><CheckIcon /> AI Matchmaking</li>
                        <li className={styles.featureItem}><CheckIcon /> 24/7 Support</li>
                        <li className={styles.featureItem}><CheckIcon /> Top-Tier Security</li>
                    </ul>
                </div>
            </div>

            {/* Money Back Banner */}
            <div className={styles.banner}>
                {/* Simulated Seal Badge */}
                <div className={styles.bannerBadge}>
                    <Image
                        src="/money_back_logo.png"
                        alt="100% Money Back Guarantee"
                        width={100}
                        height={100}
                        style={{ objectFit: 'contain' }}
                    />
                </div>

                <div className={styles.bannerText}>
                    <h3 className={styles.bannerTitle}>100% Money Back Guarantee!</h3>
                    <p className={styles.bannerDesc}>
                        You get a friendly 7 days money back guarantee.<br />
                        Read our <a href="#" className={styles.link}>Refund Policy here</a>.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Pricing;
