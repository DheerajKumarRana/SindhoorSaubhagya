"use client";

import React from 'react';
import styles from './ContactUs.module.css';
import Image from 'next/image';
import { sendToGoogleSheet } from '@/lib/googleSheet';

const ContactUs = () => {
    // Testimonials data
    const testimonials = [
        {
            text: "I was not expecting much honestly. The conversations here felt different from the start.",
            name: "Karan and Meghna",
            role: "New Delhi",
            image: "/groom-phone.png"
        },
        {
            text: "We were looking for someone for our son for almost two years. We are glad we gave this a chance.",
            name: "Suresh and Kamala",
            role: "Delhi",
            image: "/bride-phone.png"
        },
        {
            text: "Faith was really important to me and I could filter by what mattered.",
            name: "Divya and Rajat",
            role: "Delhi",
            image: "/couple-formal.png"
        },
        {
            text: "The profiles felt more real and detailed. It was a good experience overall.",
            name: "Shilpika and Rakesh",
            role: "Delhi",
            image: "/couple-traditional.png"
        },
    ];

    // Duplicate for smooth loop
    const marqueeData = [...testimonials, ...testimonials, ...testimonials];

    const [enquiry, setEnquiry] = React.useState({
        name: '',
        phone: '',
        email: '',
        message: ''
    });
    const [isSubmitted, setIsSubmitted] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleEnquiryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEnquiry({ ...enquiry, [e.target.name]: e.target.value });
    };

    const handleEnquirySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await sendToGoogleSheet({
                formType: 'contact-us-enquiry',
                submittedAt: new Date().toISOString(),
                pagePath: '/contact-us',
                name: enquiry.name,
                phone: enquiry.phone,
                email: enquiry.email,
                message: enquiry.message,
            });

            setIsSubmitted(true);
            setEnquiry({ name: '', phone: '', email: '', message: '' });
        } catch (error) {
            console.error("Error submitting enquiry:", error);
            alert("Something went wrong. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };



    return (
        <section className={styles.section}>
            {/* Header */}
            <div className={styles.titleContainer}>
                <h2 className={styles.title}>Have a Question Before You Begin?</h2>
                <p className={styles.subtitle}>
                    Write to us below and someone from our team will reach out to you directly. No sales pitch. Just an honest conversation.
                </p>
            </div>

            {/* Background Marquee Layer */}
            <div className={styles.marqueeLayer}>
                <div className={styles.marqueeContainer}>
                    {marqueeData.map((item, index) => (
                        <div key={index} className={styles.testimonialCard}>
                            <div className={styles.stars}>★★★★★</div>
                            <p className={styles.testimonialText}>&quot;{item.text}&quot;</p>
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

            {/* 3. Enquiry Form */}
            {/* 3. Enquiry Form */}
            <div className={styles.formLayer}>
                <div className={styles.formCard}>
                    <h3 className={styles.formTitle}>What would you like to know?</h3>

                    {isSubmitted ? (
                        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>✅</div>
                            <h3 style={{ color: '#2E7D32', marginBottom: '10px' }}>Thank you!</h3>
                            <p style={{ fontSize: '1.1rem', color: '#555' }}>We will reach you in 24 to 48 hrs.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleEnquirySubmit} data-sheet-ignore="true" data-form-type="contact-us-enquiry">
                            <div className={styles.formGroup}>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                    className={styles.formInput}
                                    value={enquiry.name}
                                    onChange={handleEnquiryChange}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Phone Number"
                                    className={styles.formInput}
                                    value={enquiry.phone}
                                    onChange={handleEnquiryChange}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email (Gmail)"
                                    className={styles.formInput}
                                    value={enquiry.email}
                                    onChange={handleEnquiryChange}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <textarea
                                    name="message"
                                    placeholder="Write it here and we will get back to you."
                                    className={styles.formInput}
                                    style={{ height: '100px', paddingTop: '10px', resize: 'vertical' }}
                                    value={enquiry.message}
                                    onChange={handleEnquiryChange}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className={styles.btnRegister}
                                disabled={isSubmitting}
                                style={{ opacity: isSubmitting ? 0.7 : 1 }}
                            >
                                {isSubmitting ? 'Submitting...' : 'SUBMIT'}
                            </button>
                        </form>
                    )}
                </div>
            </div>

        </section>
    );
};

export default ContactUs;
