"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Hero.module.css';
import { Heart, ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';
import { useModal } from '@/context/ModalContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const Hero = () => {
    const { openSignUp } = useModal();
    const router = useRouter();

    // Multi-step form state
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [showHearts, setShowHearts] = useState(false);
    const [showHeader, setShowHeader] = useState(false);
    const [headerText, setHeaderText] = useState('');

    // Form Data
    const [formData, setFormData] = useState({
        // Step 1: Account
        email: '',
        password: '',

        // Step 2: Profile For
        profileFor: '',
        managedBy: '',

        // Step 3: Basic
        firstName: '',
        lastName: '',
        dob: '',
        gender: '',
        lookingFor: '',
        height: '',
        maritalStatus: '',
        motherTongue: '',
        religion: '',
        caste: '',
        subCaste: '',
        manglik: 'no',

        // Step 4: Career
        degree: '',
        employedIn: '',
        occupation: '',
        income: '',
        country: 'India',
        state: '',
        city: '',

        // Step 5: Family
        familyType: '',
        fatherOcc: '',
        motherOcc: '',
        brothersTotal: '0',
        brothersMarried: '0',
        sistersTotal: '0',
        sistersMarried: '0',
        nativeCity: '',
        familyLocation: '',
        aboutFamily: '',

        // Step 6: Bio & Photo
        aboutMe: '',
        phone: '',
        otp: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        // Logic for Step 2: Auto-fill Gender and Looking For
        if (name === 'profileFor') {
            let autoGender = '';
            let autoLookingFor = '';

            if (value === 'son' || value === 'brother') {
                autoGender = 'male';
                autoLookingFor = 'bride';
            } else if (value === 'daughter' || value === 'sister') {
                autoGender = 'female';
                autoLookingFor = 'groom';
            }

            setFormData(prev => ({
                ...prev,
                [name]: value,
                gender: autoGender,
                lookingFor: autoLookingFor
            }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const triggerFlair = () => {
        const messages = ["Great Progress!", "Looking Good!", "Almost There!", "Nearly Done!", "Excellent!", "Fantastic!"];
        setHeaderText(messages[Math.floor(Math.random() * messages.length)]);
        setShowHeader(true);
        setShowHearts(true);
        setTimeout(() => setShowHeader(false), 2000);
        setTimeout(() => setShowHearts(false), 4000);
    };

    const nextStep = () => {
        triggerFlair();
        setStep(prev => prev + 1);
    };
    const prevStep = () => setStep(prev => prev - 1);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (step < 7) {
            nextStep();
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        first_name: formData.firstName,
                        last_name: formData.lastName,
                        gender: formData.gender,
                        date_of_birth: formData.dob,
                        height: formData.height,
                        marital_status: formData.maritalStatus,
                        mother_tongue: formData.motherTongue,
                        religion_name: formData.religion,
                        caste_name: formData.caste,
                        sub_caste_name: formData.subCaste,
                        manglik: formData.manglik,
                        profile_for: formData.profileFor,
                        managed_by: formData.managedBy,
                        looking_for: formData.lookingFor,
                        degree: formData.degree,
                        employed_in: formData.employedIn,
                        occupation: formData.occupation,
                        annual_income: formData.income,
                        country: formData.country,
                        state: formData.state,
                        city: formData.city,
                        family_type: formData.familyType,
                        father_occupation: formData.fatherOcc,
                        mother_occupation: formData.motherOcc,
                        brothers_total: formData.brothersTotal,
                        brothers_married: formData.brothersMarried,
                        sisters_total: formData.sistersTotal,
                        sisters_married: formData.sistersMarried,
                        native_city: formData.nativeCity,
                        family_location: formData.familyLocation,
                        about_me: formData.aboutMe,
                        phone: formData.phone,
                    },
                },
            });

            if (signUpError) throw signUpError;
            router.push('/plans');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
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

                <div className={styles.formCard}>
                    <h3 className={styles.formTitle}>
                        {showHeader && (
                            <div className={styles.successHeader}>
                                <div className={styles.successText}>{headerText}</div>
                            </div>
                        )}

                        {showHearts && (
                            <div className={styles.heartContainer}>
                                {[...Array(15)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={styles.floatingHeart}
                                        style={{
                                            left: `${Math.random() * 100}%`,
                                            animationDuration: `${3 + Math.random() * 2}s`,
                                            animationDelay: `${Math.random() * 1}s`,
                                            fontSize: `${16 + Math.random() * 20}px`,
                                            opacity: 0.8
                                        }}
                                    >
                                        ❤
                                    </div>
                                ))}
                            </div>
                        )}
                        {step === 1 && "Register"}
                        {step === 2 && "Step 2 – Profile For + Basic Info"}
                        {step === 3 && "Step 3 – Personal Details"}
                        {step === 4 && "Step 4 – Career & Education"}
                        {step === 5 && "Step 5 – Family & Lifestyle"}
                        {step === 6 && "Step 6 – About & Photos"}
                        {step === 7 && "Mobile Verification"}
                    </h3>

                    <form onSubmit={handleRegister}>
                        {step === 1 && (
                            <div className={styles.slide}>
                                <div className={styles.formGroup}>
                                    <span className={styles.inputLabel}>Create Profile for</span>
                                    <select
                                        name="profileFor"
                                        className={styles.formSelect}
                                        value={formData.profileFor}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="" disabled>Select Profile For</option>
                                        <option value="self">Self</option>
                                        <option value="son">Son</option>
                                        <option value="daughter">Daughter</option>
                                        <option value="sister">Sister</option>
                                        <option value="brother">Brother</option>
                                        <option value="friend">Relative/Friend</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <input type="email" name="email" placeholder="Email address" className={styles.formInput} value={formData.email} onChange={handleChange} required />
                                </div>
                                <div className={styles.formGroup}>
                                    <input type="tel" name="phone" placeholder="Phone number" className={styles.formInput} value={formData.phone} onChange={handleChange} required />
                                </div>
                                <div className={styles.formGroup}>
                                    <input type="password" name="password" placeholder="Create Password" className={styles.formInput} value={formData.password} onChange={handleChange} required />
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className={styles.slide}>
                                <div className={styles.formGroup}>
                                    <label className={styles.fieldLabel} style={{ display: 'block', marginBottom: '8px' }}>Profile Managed By:</label>
                                    <div className={styles.chipGroup}>
                                        {['self', 'parent', 'sibling', 'relative'].map(opt => (
                                            <div key={opt} className={styles.chip}>
                                                <input
                                                    type="radio"
                                                    name="managedBy"
                                                    id={`managedBy-${opt}`}
                                                    value={opt}
                                                    checked={formData.managedBy === opt}
                                                    onChange={handleChange}
                                                    className={styles.chipInput}
                                                    required
                                                />
                                                <label htmlFor={`managedBy-${opt}`} className={styles.chipLabel}>
                                                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <input type="text" name="firstName" placeholder="Full Name (First & Last)" className={styles.formInput} value={formData.firstName} onChange={handleChange} required />
                                </div>
                                <div className={styles.twoFields}>
                                    <div className={styles.formGroup}>
                                        <span className={styles.inputLabelSmall}>Date of Birth</span>
                                        <input type="date" name="dob" className={styles.formInput} value={formData.dob} onChange={handleChange} required />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <span className={styles.inputLabelSmall}>Gender</span>
                                        <select name="gender" className={styles.formSelect} value={formData.gender} onChange={handleChange} required>
                                            <option value="">Select</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className={`${styles.slide} ${styles.step3Content}`}>
                                <div className={styles.twoFields}>
                                    <input type="number" name="height" placeholder="Height (cm)" className={styles.formInput} value={formData.height} onChange={handleChange} required />
                                    <select name="maritalStatus" className={styles.formSelect} value={formData.maritalStatus} onChange={handleChange} required>
                                        <option value="">Marital Status</option>
                                        <option value="Never Married">Never Married</option>
                                        <option value="Divorced">Divorced</option>
                                        <option value="Widowed">Widowed</option>
                                        <option value="Awaiting Divorce">Awaiting Divorce</option>
                                    </select>
                                </div>
                                <div className={styles.twoFields}>
                                    <input type="text" name="motherTongue" placeholder="Mother Tongue" className={styles.formInput} value={formData.motherTongue} onChange={handleChange} required />
                                    <select name="religion" className={styles.formSelect} value={formData.religion} onChange={handleChange} required>
                                        <option value="">Select Religion</option>
                                        <option value="Hindu">Hindu</option>
                                        <option value="Muslim">Muslim</option>
                                        <option value="Sikh">Sikh</option>
                                        <option value="Christian">Christian</option>
                                        <option value="Jain">Jain</option>
                                    </select>
                                </div>
                                <div className={styles.twoFields}>
                                    <input type="text" name="caste" placeholder="Caste" className={styles.formInput} value={formData.caste} onChange={handleChange} required />
                                    <input type="text" name="subCaste" placeholder="Sub Caste" className={styles.formInput} value={formData.subCaste} onChange={handleChange} />
                                </div>
                                <div className={styles.twoFields}>
                                    <select name="manglik" className={styles.formSelect} value={formData.manglik} onChange={handleChange} required>
                                        <option value="no">Not Manglik</option>
                                        <option value="yes">Manglik</option>
                                        <option value="partial">Anshik Manglik</option>
                                        <option value="dont_know">Don't Know</option>
                                    </select>
                                    <div className={styles.uploadBtn}>
                                        <input type="file" id="horoscope" style={{ display: 'none' }} />
                                        <label htmlFor="horoscope" style={{ fontSize: '0.9rem', cursor: 'pointer', fontWeight: 500 }}>Upload Horoscope (Opt)</label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className={styles.slide}>
                                <div className={styles.twoFields}>
                                    <input type="text" name="degree" placeholder="Highest Degree" className={styles.formInput} value={formData.degree} onChange={handleChange} required />
                                    <select name="employedIn" className={styles.formSelect} value={formData.employedIn} onChange={handleChange} required>
                                        <option value="">Employed In</option>
                                        <option value="Private">Private</option>
                                        <option value="Government">Government</option>
                                        <option value="Business">Business</option>
                                        <option value="Self-Employed">Self Employed</option>
                                    </select>
                                </div>
                                <input type="text" name="occupation" placeholder="Occupation / Job Title" className={styles.formInput} value={formData.occupation} onChange={handleChange} required />
                                <div className={styles.twoFields}>
                                    <input type="number" name="income" placeholder="Annual Income (₹)" className={styles.formInput} value={formData.income} onChange={handleChange} required />
                                    <input type="text" name="country" placeholder="Country" className={styles.formInput} value={formData.country} onChange={handleChange} required />
                                </div>
                                <div className={styles.twoFields}>
                                    <input type="text" name="state" placeholder="State" className={styles.formInput} value={formData.state} onChange={handleChange} required />
                                    <input type="text" name="city" placeholder="City" className={styles.formInput} value={formData.city} onChange={handleChange} required />
                                </div>
                            </div>
                        )}

                        {step === 5 && (
                            <div className={styles.slide}>
                                <div className={styles.twoFields}>
                                    <select name="familyType" className={styles.formSelect} value={formData.familyType} onChange={handleChange} required>
                                        <option value="">Family Type</option>
                                        <option value="Nuclear">Nuclear</option>
                                        <option value="Joint">Joint</option>
                                    </select>
                                    <input type="text" name="nativeCity" placeholder="Native City" className={styles.formInput} value={formData.nativeCity} onChange={handleChange} />
                                </div>
                                <div className={styles.twoFields}>
                                    <input type="text" name="fatherOcc" placeholder="Father's Occ." className={styles.formInput} value={formData.fatherOcc} onChange={handleChange} />
                                    <input type="text" name="motherOcc" placeholder="Mother's Occ." className={styles.formInput} value={formData.motherOcc} onChange={handleChange} />
                                </div>
                                <div className={styles.twoFields}>
                                    <div className={styles.countInput}>
                                        <span className={styles.labelTiny}>Brothers (T/M)</span>
                                        <div style={{ display: 'flex', gap: '5px' }}>
                                            <input type="number" name="brothersTotal" placeholder="T" className={styles.formInput} value={formData.brothersTotal} onChange={handleChange} />
                                            <input type="number" name="brothersMarried" placeholder="M" className={styles.formInput} value={formData.brothersMarried} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div className={styles.countInput}>
                                        <span className={styles.labelTiny}>Sisters (T/M)</span>
                                        <div style={{ display: 'flex', gap: '5px' }}>
                                            <input type="number" name="sistersTotal" placeholder="T" className={styles.formInput} value={formData.sistersTotal} onChange={handleChange} />
                                            <input type="number" name="sistersMarried" placeholder="M" className={styles.formInput} value={formData.sistersMarried} onChange={handleChange} />
                                        </div>
                                    </div>
                                </div>
                                <input type="text" name="familyLocation" placeholder="Family Living In" className={styles.formInput} value={formData.familyLocation} onChange={handleChange} />
                                <textarea name="aboutFamily" placeholder="About my family (Optional)" className={styles.formTextarea} value={formData.aboutFamily} onChange={handleChange} style={{ height: '50px' }} />
                            </div>
                        )}

                        {step === 6 && (
                            <div className={styles.slide}>
                                <textarea
                                    name="aboutMe"
                                    placeholder="About Me (Tell us about your background, values, and what you seek in a partner. Min 50 words recommended)"
                                    className={styles.formTextarea}
                                    style={{ height: '80px' }}
                                    value={formData.aboutMe}
                                    onChange={handleChange}
                                    required
                                />
                                <span className={styles.wordCount}>
                                    {formData.aboutMe.trim().split(/\s+/).filter(Boolean).length} words
                                </span>
                                <div className={styles.photoUploads}>
                                    <div className={styles.dropZone}>
                                        <input type="file" id="photo1" style={{ display: 'none' }} />
                                        <label htmlFor="photo1">Upload Profile Photo<br /><span style={{ fontSize: '0.7rem' }}>( Drag & Drop )</span></label>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <div className={styles.smallDropZone}><input type="file" id="photo2" style={{ display: 'none' }} /><label htmlFor="photo2">+</label></div>
                                        <div className={styles.smallDropZone}><input type="file" id="photo3" style={{ display: 'none' }} /><label htmlFor="photo3">+</label></div>
                                    </div>
                                </div>
                                <div className={styles.checkboxGroup}>
                                    <input type="checkbox" id="confirm" checked={isConfirmed} onChange={(e) => setIsConfirmed(e.target.checked)} />
                                    <label htmlFor="confirm" style={{ fontSize: '0.8rem' }}>I confirm that the info provided is accurate.</label>
                                </div>
                            </div>
                        )}

                        {step === 7 && (
                            <div className={styles.slide}>
                                <div className={styles.formGroup}>
                                    <input type="tel" name="phone" placeholder="Mobile Number" className={styles.formInput} value={formData.phone} onChange={handleChange} required disabled />
                                </div>
                                <div className={styles.formGroup}>
                                    <input type="text" name="otp" placeholder="Enter OTP" className={styles.formInput} value={formData.otp} onChange={handleChange} />
                                </div>
                                <button type="button" className={styles.missedCallBtn} style={{ background: 'var(--primary-red)', color: 'white', border: 'none' }}>Verify Number</button>
                                <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#888', margin: '5px 0' }}>OR</div>
                                <button type="button" className={styles.missedCallBtn}>Get Missed Call for Verification</button>
                            </div>
                        )}

                        {error && <p className={styles.errorMsg}>{error}</p>}

                        <div className={styles.navButtons}>
                            {step > 1 && (
                                <button type="button" className={styles.btnPrev} onClick={prevStep}>
                                    <ChevronLeft size={20} /> Prev
                                </button>
                            )}
                            <button
                                type="submit"
                                className={styles.btnNext}
                                disabled={loading || (step === 6 && !isConfirmed)}
                            >
                                {loading ? 'Processing...' :
                                    step === 1 ? 'Register for free' :
                                        step === 7 ? 'Submit Details' : 'Next'}
                                {step < 7 && <ChevronRight size={20} />}
                            </button>
                        </div>
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
