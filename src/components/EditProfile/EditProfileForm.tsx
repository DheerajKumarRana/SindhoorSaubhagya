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
        marital_status: '',
        religion_id: '', // Ideally fetch religions and map
        caste_id: '',    // Ideally fetch castes and map
        mother_tongue: '',
        manglik: 'no',   // 'yes' or 'no'
        education: {},   // JSONB structure, simplified for now to string or specific fields
        profession: {},  // JSONB
        // For UI simplicity, maybe flatten some jsonb fields temporarily or manage properly
        highest_education: '',
        profession_title: ''
    });

    const [photoUrl, setPhotoUrl] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            fetchProfile();
        }
    }, [user]);

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
                    marital_status: data.marital_status || '',
                    religion_id: data.religion_id || '', // Need to handle UUID vs Name if UI uses text
                    caste_id: data.caste_id || '',
                    mother_tongue: data.mother_tongue || '',
                    manglik: 'no', // Default, need to check if schema supports this (not seen in schema, assumed 'pending' or stored in jsonb)
                    education: data.education || {},
                    profession: data.profession || {},
                    highest_education: data.education?.highest || '',
                    profession_title: data.profession?.title || ''
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
                marital_status: formData.marital_status,
                mother_tongue: formData.mother_tongue,
                // religion_id and caste_id need valid UUIDs. 
                // schema requires UUID. If UI uses text, we can't save directly unless valid.
                // For MVP, if backend expects UUID, we skip saving text IDs unless we have a mapping.
                // Assuming 'religion_id' is fetched and untouched if not changed or valid UUIDs provided.
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
                            <select className={styles.select} disabled>
                                <option>Hindu</option> {/* Placeholder */}
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Caste</label>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Brahmin"
                                disabled
                            />
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
