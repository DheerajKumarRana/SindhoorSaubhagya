"use client";

import Image from 'next/image';
import { Heart, UserCheck, Search, ArrowRight } from 'lucide-react';
import styles from './HowItWorks.module.css';

const steps = [
    {
        id: 1,
        title: "Create your profile",
        highlight: "profile",
        description: "Our AI algorithms help you see how compatible you are with your match.",
        icon: <Heart size={24} fill="currentColor" />,
        image: "/mockup.png"
    },
    {
        id: 2,
        title: "Choose a Membership",
        highlight: "Membership",
        description: "Connect confidently with matches who have been verified for authenticity.",
        icon: <UserCheck size={24} />,
        image: "/mockup.png"
    },
    {
        id: 3,
        title: "Shortlist & Select Profiles",
        highlight: "Select Profiles",
        description: "With chat you can connect with your matches on a deeper level.",
        icon: <Search size={24} />,
        image: "/mockup.png"
    },
    {
        id: 4,
        title: "Take the Next Step",
        highlight: "Next Step",
        description: "People concerned about their privacy can blur their pictures.",
        icon: <ArrowRight size={24} />,
        image: "/mockup.png"
    }
];

const HowItWorks = () => {
    return (
        <section className={styles.section}>
            <div className={styles.heading}>
                <h2 className={styles.title}>How it <span className={styles.highlight}>works</span></h2>
                <p className={styles.subtitle}>Connect with other singles and make speed data.</p>
            </div>

            <div className={styles.stepsContainer}>
                {steps.map((step, index) => (
                    <div
                        key={step.id}
                        className={`${styles.stepRow} ${index % 2 !== 0 ? styles.reverse : ''}`}
                    >
                        <div className={styles.textContent}>
                            <div className={styles.iconContainer}>
                                {step.icon}
                            </div>
                            <h3 className={styles.stepTitle}>
                                {step.title.split(step.highlight)[0]}
                                <span className={styles.highlight}>{step.highlight}</span>
                            </h3>
                            <p className={styles.stepDescription}>{step.description}</p>
                        </div>

                        <div className={styles.imageContainer}>
                            <Image
                                src={step.image}
                                alt={step.title}
                                width={300}
                                height={600}
                                className={styles.mockupImage}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default HowItWorks;
