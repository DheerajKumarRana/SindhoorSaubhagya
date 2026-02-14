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
    const [stats, setStats] = React.useState({ views: 0, acceptedInterests: 0, receivedRequests: 0 });
    const [matches, setMatches] = React.useState<any[]>([]);
    const [fetchingProfile, setFetchingProfile] = React.useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    React.useEffect(() => {
        if (!loading && !user) {
            router.push('/');
        }

        async function fetchProfile() {
            if (user) {
                try {
                    // Fetch profile
                    const { data: profileData, error: profileErr } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', user.id)
                        .single();

                    if (profileData) setProfile(profileData);

                    // Fetch stats
                    const [viewsCount, acceptedCount, receivedCount] = await Promise.all([
                        supabase.from('profile_views').select('*', { count: 'exact', head: true }).eq('viewed_profile_id', user.id),
                        supabase.from('connection_requests').select('*', { count: 'exact', head: true }).eq('sender_id', user.id).eq('status', 'accepted'),
                        supabase.from('connection_requests').select('*', { count: 'exact', head: true }).eq('receiver_id', user.id).eq('status', 'pending')
                    ]);

                    setStats({
                        views: viewsCount.count || 0,
                        acceptedInterests: acceptedCount.count || 0,
                        receivedRequests: receivedCount.count || 0
                    });

                    // Fetch recommended matches (opp gender)
                    const { data: matchesData } = await supabase
                        .from('profiles')
                        .select('id, first_name, last_name, gender, photo_url, education, location, profession')
                        .neq('gender', profileData?.gender || 'None')
                        .eq('status', 'approved')
                        .limit(4);

                    if (matchesData) setMatches(matchesData);

                } catch (error) {
                    console.error('Error fetching dashboard data:', error);
                } finally {
                    setFetchingProfile(false);
                }
            } else if (!loading && !user) {
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
                        <p>{stats.views}</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIconWrapper} style={{ background: '#FFEBEE' }}>
                        <Heart size={24} color="#E31E24" />
                    </div>
                    <div className={styles.statContent}>
                        <h4>Accepted Interests</h4>
                        <p>{stats.acceptedInterests}</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIconWrapper} style={{ background: '#E8F5E9' }}>
                        <Users size={24} color="#4CAF50" />
                    </div>
                    <div className={styles.statContent}>
                        <h4>Requests Received</h4>
                        <p>{stats.receivedRequests}</p>
                    </div>
                </div>
            </div>

            {/* Recommended Matches */}
            <h3 className={styles.sectionTitle}>Recommended Matches</h3>
            <div className={styles.recommendationsGrid}>
                {matches.length > 0 ? matches.map((item) => (
                    <div key={item.id} className={styles.profileCard}>
                        <div className={styles.cardImageWrapper}>
                            <Image
                                src={item.photo_url || "/image 1.png"}
                                alt="Profile"
                                fill
                                style={{ objectFit: 'cover' }}
                                unoptimized
                            />
                        </div>
                        <div className={styles.cardContent}>
                            <h4 className={styles.cardName}>{item.first_name}, {item.age || 'N/A'}</h4>
                            <p className={styles.cardDetail}>{item.profession?.title || 'Member'}, {item.location?.city || 'India'}</p>
                            <button className={styles.viewProfileBtn}>View Profile</button>
                        </div>
                    </div>
                )) : (
                    <p style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px', color: '#666' }}>No recommended matches found yet.</p>
                )}
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
