"use client";

import React from 'react';
import { MapPin, Mail, Phone, Send } from 'lucide-react';
import styles from './ContactFormSection.module.css';

const ContactFormSection = () => {
    return (
        <section className={styles.section}>
            <div className={styles.container}>

                {/* Left Side - Form */}
                <div className={styles.formSide}>
                    <h2 className={styles.formTitle}>Send us a Message</h2>
                    <form>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Full Name</label>
                            <input type="text" placeholder="Enter your full name" className={styles.input} />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Email Address</label>
                            <input type="email" placeholder="your.email@example.com" className={styles.input} />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Phone Number</label>
                            <input type="tel" placeholder="+91 98765 43210" className={styles.input} />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Subject</label>
                            <select className={styles.select} defaultValue="">
                                <option value="" disabled>Select a subject</option>
                                <option value="general">General Inquiry</option>
                                <option value="support">Technical Support</option>
                                <option value="billing">Billing</option>
                                <option value="feedback">Feedback</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Message / Query</label>
                            <textarea placeholder="Tell us how we can help you..." className={styles.textarea}></textarea>
                        </div>

                        <button type="submit" className={styles.submitButton}>
                            Send Message
                        </button>
                    </form>
                </div>

                {/* Right Side - Info */}
                <div className={styles.infoSide}>
                    <h3 className={styles.infoTitle}>Contact Information</h3>

                    {/* Address */}
                    <div className={styles.infoItem}>
                        <div className={styles.iconCircle}>
                            <MapPin size={24} color="#E31E24" />
                        </div>
                        <div className={styles.infoContent}>
                            <h4>Office Address</h4>
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
                            <h4>Email Address</h4>
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
                            <h4>Contact Number</h4>
                            <p>+91 98765 43210</p>
                            <p>+91 98765 43211 (Toll Free)</p>
                        </div>
                    </div>

                    <div className={styles.separator}></div>

                    <h4 className={styles.operatingTitle}>Operating Hours</h4>
                    <p className={styles.operatingText}>Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p className={styles.operatingText}>Saturday: 10:00 AM - 4:00 PM</p>
                    <p className={styles.operatingText}>Sunday: Closed</p>

                </div>
            </div>
        </section>
    );
};

export default ContactFormSection;
