"use client";
import React, { useState } from "react";
import styles from "./MatrimonyQueries.module.css";
import Image from "next/image";

const faqs = [
    {
        question: "1. How do I register?",
        answer:
            "Loreis mis lore sipum lore m ispum lore spim lroe imsim llore ispumdey uneseo lorem advbhf ahr hsjfloreis mis lore sipum lore m ispum lore spim lroe imsim llore ispumdey uneseo lorem advbhf ahr hsjf",
    },
    {
        question: "2. Can I search for profiles by Christian community?",
        answer: "Yes, you can search for profiles specifically within the Christian community using our advanced search filters.",
    },
    {
        question: "3. Is the app free to download?",
        answer: "Yes, the app is free to download on both iOS and Android stores.",
    },
    {
        question: "4. Are my personal details safe?",
        answer: "Absolutely. We prioritize your privacy and ensure all personal details are encrypted and secure.",
    },
    {
        question: "5. How do I contact customer support?",
        answer: "You can contact our customer support via the 'Contact Us' section in the app or website.",
    },
];

const MatrimonyQueries: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className={styles.section}>
            <h2 className={styles.heading}>
                Your <span className={styles.highlight}>Matrimony</span> Queries
            </h2>

            <div className={styles.container}>
                {/* Left Side - Images */}
                <div className={styles.imageGrid}>
                    <div className={styles.imageWrapper}>
                        <Image
                            src="/couple-traditional.png"
                            alt="Couple Traditional"
                            fill
                            className={styles.image}
                        />
                    </div>
                    <div className={styles.imageWrapper}>
                        <Image
                            src="/couple-formal.png"
                            alt="Couple Formal"
                            fill
                            className={styles.image}
                        />
                    </div>
                    <div className={styles.imageWrapper}>
                        <Image
                            src="/couple_1.png"
                            alt="Couple 1"
                            fill
                            className={styles.image}
                        />
                    </div>
                    <div className={styles.imageWrapper}>
                        <Image
                            src="/bride-phone.png"
                            alt="Bride"
                            fill
                            className={styles.image}
                        />
                    </div>
                </div>

                {/* Right Side - FAQ Accordion */}
                <div className={styles.faqList}>
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`${styles.faqItem} ${openIndex === index ? styles.active : ""
                                }`}
                            onClick={() => toggleFAQ(index)}
                        >
                            <div className={styles.faqHeader}>
                                <span className={styles.question}>{faq.question}</span>
                                <span className={styles.icon}>
                                    <svg
                                        width="14"
                                        height="8"
                                        viewBox="0 0 14 8"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={`${styles.arrow} ${openIndex === index ? styles.arrowOpen : ''}`}
                                    >
                                        <path d="M1 1L7 7L13 1" stroke="#D32F2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                            </div>
                            <div className={`${styles.faqBody} ${openIndex === index ? styles.open : ''}`}>
                                <div className={styles.faqInner}>
                                    <div className={styles.faqContent}>
                                        {faq.answer}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MatrimonyQueries;
