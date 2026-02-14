"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { User, Users, GraduationCap, X } from 'lucide-react';
import styles from './EditProfile.module.css';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthProvider';
import { useRouter } from 'next/navigation';

const EditProfileForm = () => {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        dob: '',
        gender: '',
        height: '',
        weight: '',
        marital_status: '',
        religion_id: '',
        caste_id: '',
        mother_tongue: '',
        manglik: 'no',
        education: {} as any,
        profession: {} as any,
        highest_education: '',
        profession_title: '',
        annual_income: '',
        complexion: '',
        body_type: '',
        blood_group: '',
        about_me: '',
        city: '',
        state: '',
        country: 'India'
    });

    const [religions, setReligions] = useState<any[]>([]);
    const [castes, setCastes] = useState<any[]>([]);
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);

    useEffect(() => {
        fetchReligions();
        if (user) {
            fetchProfile();
        }
    }, [user]);

    useEffect(() => {
        if (formData.religion_id) {
            fetchCastes(formData.religion_id);
        } else {
            setCastes([]);
        }
    }, [formData.religion_id]);

    const fetchReligions = async () => {
        const { data, error } = await supabase
            .from('religions')
            .select('id, name')
            .eq('is_active', true)
            .order('display_order', { ascending: true });

        if (data) setReligions(data);
    };

    const fetchCastes = async (religionId: string) => {
        const { data, error } = await supabase
            .from('castes')
            .select('id, name')
            .eq('religion_id', religionId)
            .eq('is_active', true)
            .order('display_order', { ascending: true });

        if (data) setCastes(data);
    };

    const fetchProfile = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user?.id)
                .single();

            if (data) {
                setFormData({
                    first_name: data.first_name || '',
                    last_name: data.last_name || '',
                    dob: data.date_of_birth || '',
                    gender: data.gender || '',
                    height: data.height ? data.height.toString() : '',
                    weight: data.weight ? data.weight.toString() : '',
                    marital_status: data.marital_status || '',
                    religion_id: data.religion_id || '',
                    caste_id: data.caste_id || '',
                    mother_tongue: data.mother_tongue || '',
                    manglik: data.horoscope?.manglik || 'no',
                    education: data.education || {},
                    profession: data.profession || {},
                    highest_education: data.education?.highest || '',
                    profession_title: data.profession?.title || '',
                    annual_income: data.annual_income ? data.annual_income.toString() : '',
                    complexion: data.complexion || '',
                    body_type: data.body_type || '',
                    blood_group: data.blood_group || '',
                    about_me: data.about_me || '',
                    city: data.location?.city || '',
                    state: data.location?.state || '',
                    country: data.location?.country || 'India'
                });
                setPhotoUrl(data.photo_url);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleManglikChange = (value: string) => {
        setFormData(prev => ({ ...prev, manglik: value }));
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${user?.id}-${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        setSaving(true);
        try {
            // Upload to Supabase Storage (assuming 'profile-photos' bucket exists and is public/authenticated)
            const { error: uploadError } = await supabase.storage
                .from('profile-photos')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('profile-photos')
                .getPublicUrl(filePath);

            // Update Profile
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ photo_url: publicUrl })
                .eq('id', user?.id);

            if (updateError) throw updateError;

            setPhotoUrl(publicUrl);
            setMessage({ type: 'success', text: 'Photo updated successfully!' });

        } catch (error: any) {
            console.error('Error uploading photo:', error);
            setMessage({ type: 'error', text: error.message || 'Failed to upload photo' });
        } finally {
            setSaving(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            // Construct update object - separate jsonb fields
            const updates = {
                first_name: formData.first_name,
                last_name: formData.last_name,
                gender: formData.gender,
                date_of_birth: formData.dob || null, // handle empty string
                height: formData.height ? parseFloat(formData.height) : null,
                weight: formData.weight ? parseFloat(formData.weight) : null,
                marital_status: formData.marital_status,
                mother_tongue: formData.mother_tongue,
                religion_id: formData.religion_id || null,
                caste_id: formData.caste_id || null,
                annual_income: formData.annual_income ? parseFloat(formData.annual_income) : null,
                complexion: formData.complexion,
                body_type: formData.body_type,
                blood_group: formData.blood_group,
                about_me: formData.about_me,
                location: {
                    city: formData.city,
                    state: formData.state,
                    country: formData.country
                },
                education: { highest: formData.highest_education },
                profession: { title: formData.profession_title },
                horoscope: { manglik: formData.manglik },
                updated_at: new Date().toISOString(),
            };

            const { error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', user?.id);

            if (error) throw error;

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            // Optionally redirect after delay
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.title}>
                    <User size={24} color="#E31E24" />
                    Edit Profile
                </div>
                <button className={styles.closeBtn} onClick={() => router.push('/dashboard')}>
                    <X size={18} />
                </button>
            </div>

            {message && (
                <div style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    backgroundColor: message.type === 'success' ? '#e6fffa' : '#fff5f5',
                    color: message.type === 'success' ? '#047857' : '#c53030',
                    border: `1px solid ${message.type === 'success' ? '#047857' : '#c53030'}`
                }}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* Personal Info Section */}
                <div className={styles.section}>
                    <div className={styles.sectionTitle}>
                        <User size={20} color="#E31E24" />
                        Personal info
                    </div>

                    <div className={styles.formGrid}>
                        {/* Left Column: Photo */}
                        <div className={styles.photoColumn}>
                            {photoUrl ? (
                                <Image
                                    src={photoUrl}
                                    alt="Profile"
                                    width={150}
                                    height={150}
                                    className={styles.profileImage}
                                    style={{ objectFit: 'cover' }}
                                    unoptimized
                                />
                            ) : (
                                <div className={`${styles.profileImage} ${styles.avatarPlaceholder}`}>
                                    <User size={64} color="#ccc" />
                                </div>
                            )}
                            <label className={styles.changePhotoBtn}>
                                Change Photo
                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={handlePhotoUpload}
                                    disabled={saving}
                                />
                            </label>
                        </div>

                        {/* Right Column: Fields */}
                        <div className={styles.fieldsGrid}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>First Name</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    className={styles.input}
                                    value={formData.first_name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Last Name</label>
                                <input
                                    type="text"
                                    name="last_name"
                                    className={styles.input}
                                    value={formData.last_name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Date of Birth</label>
                                <div className={styles.dateInputWrapper}>
                                    <input
                                        type="date"
                                        name="dob"
                                        className={styles.input}
                                        style={{ width: '100%' }}
                                        value={formData.dob}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Gender</label>
                                <select
                                    name="gender"
                                    className={styles.select}
                                    value={formData.gender}
                                    onChange={handleChange}
                                >
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Height (cm)</label>
                                <input
                                    type="number"
                                    name="height"
                                    className={styles.input}
                                    placeholder="e.g. 175"
                                    value={formData.height}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Marital Status</label>
                                <select
                                    name="marital_status"
                                    className={styles.select}
                                    value={formData.marital_status}
                                    onChange={handleChange}
                                >
                                    <option value="">Select</option>
                                    <option value="Never Married">Never Married</option>
                                    <option value="Divorced">Divorced</option>
                                    <option value="Widowed">Widowed</option>
                                    <option value="Awaiting Divorce">Awaiting Divorce</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Religion & Community Section */}
                <div className={styles.section}>
                    <div className={styles.sectionTitle}>
                        <Users size={20} color="#E31E24" />
                        Religion & Community
                    </div>
                    <div className={styles.fieldsGrid}>
                        {/* 
                            Ideally these selects should be populated from 'religions' and 'castes' tables. 
                            For MVP, using text inputs or minimal static options if IDs are not strictly enforced by UI dropdowns yet.
                            Or fetching master data. Let's keep it simple for now or assume IDs.
                            Actually the schema has UUIDs. If we send text it will fail.
                            For now, let's use a read-only or basic static mapping if known, or text input for 'Mother Tongue'.
                        */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Religion</label>
                            <select
                                name="religion_id"
                                className={styles.select}
                                value={formData.religion_id}
                                onChange={handleChange}
                            >
                                <option value="">Select Religion</option>
                                {religions.map(r => (
                                    <option key={r.id} value={r.id}>{r.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Caste</label>
                            <select
                                name="caste_id"
                                className={styles.select}
                                value={formData.caste_id}
                                onChange={handleChange}
                                disabled={!formData.religion_id}
                            >
                                <option value="">Select Caste</option>
                                {castes.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Mother Tongue</label>
                            <select
                                name="mother_tongue"
                                className={styles.select}
                                value={formData.mother_tongue}
                                onChange={handleChange}
                            >
                                <option value="">Select</option>
                                <option value="Hindi">Hindi</option>
                                <option value="English">English</option>
                                <option value="Gujarati">Gujarati</option>
                                <option value="Marathi">Marathi</option>
                                <option value="Punjabi">Punjabi</option>
                                <option value="Tamil">Tamil</option>
                                <option value="Telugu">Telugu</option>
                                <option value="Bengali">Bengali</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Manglik Status</label>
                            <div className={styles.radioGroup}>
                                <label className={styles.radioLabel}>
                                    <input
                                        type="radio"
                                        name="manglik"
                                        value="no"
                                        checked={formData.manglik === 'no'}
                                        onChange={() => handleManglikChange('no')}
                                        className={styles.radioInput}
                                    />
                                    No
                                </label>
                                <label className={styles.radioLabel}>
                                    <input
                                        type="radio"
                                        name="manglik"
                                        value="yes"
                                        checked={formData.manglik === 'yes'}
                                        onChange={() => handleManglikChange('yes')}
                                        className={styles.radioInput}
                                    />
                                    Yes
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Education & Career Section */}
                <div className={styles.section}>
                    <div className={styles.sectionTitle}>
                        <GraduationCap size={20} color="#E31E24" />
                        Education & Career
                    </div>
                    <div className={styles.fieldsGrid}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Highest Education</label>
                            <select
                                name="highest_education"
                                className={styles.select}
                                value={formData.highest_education}
                                onChange={handleChange}
                            >
                                <option value="">Select</option>
                                <option value="High School">High School</option>
                                <option value="Bachelors">Bachelors</option>
                                <option value="Masters">Masters</option>
                                <option value="Doctorate">Doctorate</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Profession</label>
                            <select
                                name="profession_title"
                                className={styles.select}
                                value={formData.profession_title}
                                onChange={handleChange}
                            >
                                <option value="">Select</option>
                                <option value="Software Developer">Software Developer</option>
                                <option value="Doctor">Doctor</option>
                                <option value="Engineer">Engineer</option>
                                <option value="Teacher">Teacher</option>
                                <option value="Business">Business</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Physical Attributes & Income */}
                <div className={styles.section}>
                    <div className={styles.sectionTitle}>
                        <Users size={20} color="#E31E24" />
                        Physical & Income
                    </div>
                    <div className={styles.fieldsGrid}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Weight (kg)</label>
                            <input
                                type="number"
                                name="weight"
                                className={styles.input}
                                placeholder="e.g. 70"
                                value={formData.weight}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Complexion</label>
                            <select name="complexion" className={styles.select} value={formData.complexion} onChange={handleChange}>
                                <option value="">Select</option>
                                <option value="Very Fair">Very Fair</option>
                                <option value="Fair">Fair</option>
                                <option value="Wheatish">Wheatish</option>
                                <option value="Dark">Dark</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Body Type</label>
                            <select name="body_type" className={styles.select} value={formData.body_type} onChange={handleChange}>
                                <option value="">Select</option>
                                <option value="Slim">Slim</option>
                                <option value="Athletic">Athletic</option>
                                <option value="Average">Average</option>
                                <option value="Heavy">Heavy</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Blood Group</label>
                            <select name="blood_group" className={styles.select} value={formData.blood_group} onChange={handleChange}>
                                <option value="">Select</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Annual Income (₹)</label>
                            <input
                                type="number"
                                name="annual_income"
                                className={styles.input}
                                placeholder="e.g. 1200000"
                                value={formData.annual_income}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                {/* Location & About */}
                <div className={styles.section}>
                    <div className={styles.sectionTitle}>
                        <Users size={20} color="#E31E24" />
                        Location & Bio
                    </div>
                    <div className={styles.fieldsGrid}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>City</label>
                            <input type="text" name="city" className={styles.input} value={formData.city} onChange={handleChange} />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>State</label>
                            <input type="text" name="state" className={styles.input} value={formData.state} onChange={handleChange} />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Country</label>
                            <input type="text" name="country" className={styles.input} value={formData.country} onChange={handleChange} />
                        </div>
                    </div>
                    <div className={styles.formGroup} style={{ marginTop: '20px' }}>
                        <label className={styles.label}>About Me</label>
                        <textarea
                            name="about_me"
                            className={styles.input}
                            style={{ minHeight: '100px', resize: 'vertical' }}
                            value={formData.about_me}
                            onChange={(e: any) => handleChange(e as any)}
                        />
                    </div>
                </div>

                {/* Footer Actions */}
                <div className={styles.footerActions}>
                    <button type="button" className={styles.cancelBtn} onClick={() => router.push('/dashboard')}>
                        Cancel
                    </button>
                    <button type="submit" className={styles.saveBtn} disabled={saving}>
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProfileForm;
