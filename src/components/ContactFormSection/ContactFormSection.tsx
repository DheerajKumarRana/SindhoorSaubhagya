"use client";

import React from 'react';
import { MapPin, Mail, Phone } from 'lucide-react';
import styles from './ContactFormSection.module.css';
import { sendToGoogleSheet } from '@/lib/googleSheet';

const ContactFormSection = () => {
    const [formData, setFormData] = React.useState({
        fullName: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [submitMessage, setSubmitMessage] = React.useState<string | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage(null);

        try {
            await sendToGoogleSheet({
                formType: 'contact-page-message',
                submittedAt: new Date().toISOString(),
                pagePath: '/contact',
                ...formData,
            });

            setSubmitMessage('Message submitted successfully. We will get back to you within a few hours.');
            setFormData({
                fullName: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
            });
        } catch (error) {
            console.error('ContactFormSection: submit failed', error);
            setSubmitMessage('Unable to submit right now. Please try again in a moment.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className={styles.section}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionHeading}>Write to Us Directly</h2>
                <p className={styles.sectionSubheading}>
                    Share your question, concern, or feedback below and we will get back to you personally within a few hours.
                </p>
            </div>
            <div className={styles.container}>

                {/* Left Side - Form */}
                <div className={styles.formSide}>
                    <h2 className={styles.formTitle}>Write to Us Directly</h2>
                    <form onSubmit={handleSubmit} data-sheet-ignore="true" data-form-type="contact-page-message">
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Your Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                placeholder="Enter your full name"
                                className={styles.input}
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Your Email Address</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="your.email@example.com"
                                className={styles.input}
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Your Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                placeholder="+91 98765 43210"
                                className={styles.input}
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>What Is This About?</label>
                            <select
                                className={styles.select}
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled>Select a subject</option>
                                <option value="general-question">General Question</option>
                                <option value="technical-help">Technical Help</option>
                                <option value="membership-billing">Membership and Billing</option>
                                <option value="share-feedback">Share Feedback</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Write Your Message Here</label>
                            <textarea
                                name="message"
                                placeholder="Tell us how we can help you..."
                                className={styles.textarea}
                                value={formData.message}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>

                        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit My Message'}
                        </button>
                        {submitMessage && (
                            <p style={{ marginTop: '12px', fontSize: '14px', color: '#333' }}>{submitMessage}</p>
                        )}
                    </form>
                </div>

                {/* Right Side - Info */}
                <div className={styles.infoSide}>
                    <h3 className={styles.infoTitle}>Prefer to Reach Out Directly?</h3>

                    {/* Address */}
                    <div className={styles.infoItem}>
                        <div className={styles.iconCircle}>
                            <MapPin size={24} color="#E31E24" />
                        </div>
                        <div className={styles.infoContent}>
                            <h4>Visit Our Office</h4>
                            <p>123 Matrimony Plaza, Connaught Place</p>
                            <p>New Delhi - 110001, India</p>
                        </div>
                    </div>

                    {/* Email */}
                    <div className={styles.infoItem}>
                        <div className={styles.iconCircle}>
                            <Mail size={24} color="#E31E24" />
                        </div>
                        <div className={styles.infoContent}>
                            <h4>Write to Us</h4>
                            <a href="mailto:support@matrimony.com">support@matrimony.com</a>
                            <a href="mailto:care@matrimony.com">care@matrimony.com</a>
                        </div>
                    </div>

                    {/* Phone */}
                    <div className={styles.infoItem}>
                        <div className={styles.iconCircle}>
                            <Phone size={24} color="#E31E24" />
                        </div>
                        <div className={styles.infoContent}>
                            <h4>Give Us a Call</h4>
                            <p>+91 98765 43210</p>
                            <p>+91 98765 43211</p>
                        </div>
                    </div>

                    <div className={styles.separator}></div>

                    <h4 className={styles.operatingTitle}>When We Are Available</h4>
                    <p className={styles.operatingText}>Monday to Friday: 9:00 AM to 6:00 PM</p>
                    <p className={styles.operatingText}>Saturday: 10:00 AM to 4:00 PM</p>
                    <p className={styles.operatingText}>Sunday: Closed</p>

                </div>
            </div>
        </section>
    );
};

export default ContactFormSection;
