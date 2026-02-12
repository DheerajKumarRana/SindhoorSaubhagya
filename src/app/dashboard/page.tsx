"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Home, Heart, Users, User, Bell, Edit, Menu } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import styles from './dashboard.module.css';
import { useAuth } from '@/context/AuthProvider';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar/Sidebar';


export default function Dashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [profile, setProfile] = React.useState<any>(null);
    const [fetchingProfile, setFetchingProfile] = React.useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    React.useEffect(() => {
        if (!loading && !user) {
            router.push('/');
        }

        async function fetchProfile() {
            if (user) {
                try {
                    const { data, error } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', user.id)
                        .single();

                    if (data) setProfile(data);
                } catch (error) {
                    console.error('Error fetching profile:', error);
                } finally {
                    setFetchingProfile(false);
                }
            } else if (!loading && !user) { // If user is null and not loading, stop fetching
                setFetchingProfile(false);
            }
        }

        fetchProfile();
    }, [user, loading, router]);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const isPremium = profile?.is_premium || false;

    if (loading || fetchingProfile) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;

    return (
        <>
            {/* Header (User Widget) */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <div className={styles.userWidget}>
                    {profile?.photo_url ? (
                        <Image
                            src={profile.photo_url}
                            alt="User"
                            width={40}
                            height={40}
                            style={{ borderRadius: '50%', objectFit: 'cover' }}
                            unoptimized
                        />
                    ) : (
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <User size={20} color="#999" />
                        </div>
                    )}
                    <div className={styles.userWidgetInfo}>
                        <span className={styles.userWidgetName}>
                            {profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Valued Member' : 'Loading...'}
                        </span>
                        <span className={styles.userWidgetRole}>{isPremium ? 'Premium Member' : 'Free Member'}</span>
                    </div>
                    {/* Link to Edit Profile */}
                    <Link href="/dashboard/edit-profile">
                        <div style={{ background: '#E31E24', padding: '5px', borderRadius: '50%', color: 'white', display: 'flex', cursor: 'pointer', marginLeft: '10px' }}>
                            <Edit size={14} />
                        </div>
                    </Link>
                </div>
            </div>

            {/* Stats Row */}
            <div className={styles.statsRow}>
                <div className={styles.statCard}>
                    <div className={styles.statIconWrapper} style={{ background: '#E3F2FD' }}>
                        <User size={24} color="#2196F3" />
                    </div>
                    <div className={styles.statContent}>
                        <h4>Profile Views</h4>
                        <p>128</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIconWrapper} style={{ background: '#FFEBEE' }}>
                        <Heart size={24} color="#E31E24" />
                    </div>
                    <div className={styles.statContent}>
                        <h4>Accepted Interests</h4>
                        <p>56</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIconWrapper} style={{ background: '#E8F5E9' }}>
                        <Users size={24} color="#4CAF50" />
                    </div>
                    <div className={styles.statContent}>
                        <h4>Requests Received</h4>
                        <p>32</p>
                    </div>
                </div>
            </div>

            {/* Recommended Matches */}
            <h3 className={styles.sectionTitle}>Recommended Matches</h3>
            <div className={styles.recommendationsGrid}>
                {[
                    { id: 1, name: "Ankita, 28", job: "Doctor", loc: "Bengaluru", img: "/image 1.png" },
                    { id: 2, name: "Sneha, 26", job: "Engineer", loc: "Mumbai", img: "/image 2.png" },
                    { id: 3, name: "Priya, 27", job: "Architect", loc: "Delhi", img: "/image 3.png" },
                    { id: 4, name: "Riya, 25", job: "Designer", loc: "Pune", img: "/image 4.png" }
                ].map((item) => (
                    <div key={item.id} className={styles.profileCard}>
                        <div className={styles.cardImageWrapper}>
                            <Image
                                src={item.img}
                                alt="Profile"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                        <div className={styles.cardContent}>
                            <h4 className={styles.cardName}>{item.name}</h4>
                            <p className={styles.cardDetail}>{item.job}, {item.loc}</p>
                            <button className={styles.viewProfileBtn}>View Profile</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* People Interested (Blurred) */}
            <h3 className={styles.sectionTitle}>People Interested</h3>
            <div className={styles.interestedSection}>
                {!isPremium && (
                    <div className={styles.premiumOverlay}>
                        <h3>Upgrade to see who's interested!</h3>
                        <button className={styles.upgradeBtn}>View Plans</button>
                    </div>
                )}

                <div className={styles.interestedList}>
                    {[1, 2, 3].map((item) => (
                        <div key={item} style={{ padding: '15px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <strong>Rahul, 31</strong> <span style={{ color: '#888' }}>Sent you Match Request</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
